# weapn

For changes to the root API in 0.3.0, see [MIGRATION.md](./MIGRATION.md).

## Worker-backed application

`@azulamb/weapn/app` provides an application facade that keeps Windows and
WebView2 on an internal STA UI Worker. Application handlers, file reads, timers,
and an optional HTTP server run on the main thread. The root export provides the
same Worker-backed API.

```ts
import { WeapnApp } from '@azulamb/weapn/app';

const app = new WeapnApp(import.meta, {
  title: 'My app',
  backgroundColor: '#ffffff',
});
app.mountAssets(new URL('./frontend/', import.meta.url));
app.onMessage(async ({ data }) => {
  if (
    data && typeof data === 'object' && 'type' in data &&
    data.type === 'maximize'
  ) {
    await app.window.maximize();
  }
});
await app.start();
await app.setUrl('https://app.example/index.html');
await app.closed;
```

`backgroundColor` accepts an opaque `#RRGGBB` color. It sets the native window
background before WebView2 initializes and the WebView2 background before the
first navigation. When omitted, existing defaults are used. A page's CSS
background takes precedence once loaded; match this option to the page's color
to avoid a startup flash. This option changes the initial appearance, not the
initialization time.

The frontend sends objects using
`chrome.webview.postMessage({ type: 'maximize' })`. Window operations return
Promises: `maximize()`, `minimize()`, `restore()`, `setTitle(title)`, and
`close()`. `onWindowEvent()` receives notifications for `WM_SIZE` and
`WM_DESTROY`; it does not replace the synchronous native window procedure.

Register resource handling before `start()`. As an alternative to
`mountAssets()`, use
`onResourceRequest((request) => Response | Promise<Response>)`. The default
filter is `https://app.example/*`; `resourceFilter` can select another origin.
Native event arguments and deferrals stay in the UI Worker. Requests and results
cross the boundary as ordinary data. Resource handlers currently support GET and
HEAD, receive URL/method (not original request headers), and buffer response
bodies in memory. POST bodies, range serving, and continuous streams are not
implemented. Errors produce 500 responses and the default resource timeout
produces 504 after 30 seconds. `resourceTimeoutMs` and `startupTimeoutMs`
configure these timeouts.

The UI Worker processes up to 64 Windows messages per turn with `PeekMessageW`,
then yields to Deno using an 8 ms timer. Native streams use `SHCreateMemStream`
directly through FFI; the project DLL remains unchanged. This implementation is
for Windows x64 and requires WebView2 Runtime. Long main-thread CPU work should
use another Worker. Synchronous native return values such as hit testing remain
inside the UI Worker.

### Measure startup

Enable `startupTiming: true` in `WeapnApp` options to log DLL preparation,
Worker-to-ready duration, native window creation, WebView2
Environment/Controller creation, navigation duration and resource response
handling through `logger.info`. Timing logs are opt-in. Nested phase durations
overlap; do not sum all lines.

From `sample3/`, run:

```sh
deno task start --startup-timing
```

Add `--startup-timing-exit` to close automatically after frontend readiness. The
sample reports browser Navigation Timing and a main-entry-to-ready duration
after `load` and two animation frames. This is a readiness approximation, not a
measurement of the exact physical display time, and excludes Deno startup and
module imports before main's top-level code executes.

To compare hostnames or physical-folder mapping, run:

```sh
deno task start --startup-timing --startup-timing-exit --startup-timing-host app.example
deno task start --startup-timing --startup-timing-exit --startup-timing-host app.example --startup-timing-folder
```

The folder option requires physical frontend files and is intended for
development diagnostics. It does not test exe-embedded assets.

In local development measurements with the same sample/profile, `app.local` took
about 2.03 seconds for navigation and 2.75 seconds from main entry to frontend
readiness. `app.example` took about 0.11 seconds for navigation and 0.76 seconds
to readiness. Both response interception and physical-folder mapping showed the
same approximately two-second hostname-related delay. These are observed values
on this machine, not cold-start guarantees. Microsoft documents that `.local`
hostnames can cause navigation delays in the
[virtual host mapping reference](https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2_3).
The default origin is now `https://app.example`. The host option supports
comparison with other hostnames, including `--startup-timing-host app.local`.
Applications migrating from the previous origin should update navigation URLs
and explicit resource filters or host mappings together. Origin-scoped data,
including localStorage and IndexedDB, is separate for the new hostname.

### Run the sample

From `weapn/sample3/`:

```sh
deno task start
deno task build
```

The build produces `dist/app.exe` and `dist/webview2.dll`. The executable
contains the internal Worker and frontend assets; no server, bat launcher, or
separate frontend files are needed. WebView2 creates its user-data folder at
runtime. By default, the DLL and `.weapn-data` paths are relative to the
executable directory in compiled mode and the working directory in development.
`dllPath` and `userDataFolder` override them.

In development, `start()` copies the package's DLL into the working directory if
`webview2.dll` is missing. Existing files are kept. No prepare step is needed.
This requires write permission and, when using the package from JSR, network
permission to download the DLL. An explicit `dllPath` is used as provided and is
not automatically populated. Compiled applications use the DLL placed by the
build helper.

### Build your application

```ts
import { build } from '@azulamb/weapn/build';

await build({
  entry: './main.ts',
  output: './dist/app.exe',
  assets: ['./frontend/'],
  // permissions: ['--allow-net'], // When the application uses a server/network.
});
```

Run the build script with `--allow-read --allow-write --allow-net --allow-run`.
Paths in build options are relative to the build process working directory. The
helper includes the package's Worker entry directly with
`deno compile --include`, includes the assets, and copies the DLL matching the
WebView2 package beside the executable after a successful compile. Direct
`deno compile main.ts` needs the Worker entry included explicitly. No
`.weapn-build` files are generated. The build embeds FFI/read/env permissions by
default; `permissions` adds runtime permission flags, and `terminal: true`
retains the console.

The internal UI Worker is included automatically. Additional Worker entrypoints
can be selected in the build script:

```ts
await build({
  entry: './main.ts',
  output: './dist/app.exe',
  assets: ['./frontend/'],
  workers: [import.meta.resolve('@azulamb/weapn/worker')],
});
```

`workers` accepts JSR/HTTP/file URLs or local paths starting with `./`. Resolve
dependency names with `import.meta.resolve()` in your build script, as shown
above, so resolution uses your application's imports. This example explicitly
selects the default UI Worker; it can also list other application Workers.
Included modules are embedded at build time and require no network access to
load at runtime. The `/worker` export is an executable Worker entry;
`/ui-worker` exports the `startUIWorker` function. For a manual build, use
`--include jsr:@azulamb/weapn@0.3.0/worker` alongside the application's
entrypoint and asset includes. Custom Worker entries must be ES modules (use an
import/export, or `export {}` for a standalone entry). `deno task test:build`
verifies remote Worker embedding and DLL copying on Windows.

`deno task test:worker` runs the main-side protocol tests. For the opt-in native
integration test, set `WEAPN_NATIVE_TEST=1` and run
`deno test --allow-read --allow-write --allow-env --allow-ffi tests/ui_smoke_test.ts`.
It creates a window, serves a response from main, exercises window commands from
a frontend message, and closes the window automatically.

## Environment

- Deno
  - `^2.9.7`
- @azulamb/webview2
  - https://jsr.io/@azulamb/webview2
  - webview2.dll and wrapper.
- @azulamb/winapi
  - https://jsr.io/@azulamb/winapi
  - Windows API wrapper.

## Build

For the original sample, run this command from `weapn/sample/`. The DLL is
copied automatically when missing during development, and the build places it
beside the executable.

```sh
deno task build
```

The custom response sample builds `app.exe`. Each sample has its own
`deno.json`; run `deno task start` and `deno task check` inside the sample
directory. `sample2` uses the Worker-backed API and
`setVirtualHostNameToFolderMapping()` to serve a physical `docs/` directory
directly through WebView2. Register the mapping before `start()`; paths are file
URLs or paths relative to the working directory. The default cross-origin access
setting is `denyCors`. This requires files on disk, so exe-embedded frontend
assets should use `mountAssets()` as shown in `sample3`. The `sample`
demonstrates asynchronous `onResourceRequest()` handling on main with native
response creation on the UI Worker.

## Other

### TODO

- DLLのサイズと内容チェック
  - 古いなら更新等
- DLLのバージョン指定
  - バージョンはライブラリのタグベース。
- PostMessage（クライアント向け）のライブラリ追加
- ドキュメント
  - アイコンに関する説明の追加
  - PostMessageの説明
