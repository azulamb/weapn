# weapn

## Worker-backed application

`@azulamb/weapn/app` provides an application facade that keeps Windows and
WebView2 on an internal STA UI Worker. Application handlers, file reads, timers,
and an optional HTTP server run on the main thread. The existing root export
continues to provide the original synchronous API.

```ts
import { WeapnApp } from '@azulamb/weapn/app';

const app = new WeapnApp(import.meta, { title: 'My app' });
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
await app.setUrl('https://app.local/index.html');
await app.closed;
```

The frontend sends objects using
`chrome.webview.postMessage({ type: 'maximize' })`. Window operations return
Promises: `maximize()`, `minimize()`, `restore()`, `setTitle(title)`, and
`close()`. `onWindowEvent()` receives notifications for `WM_SIZE` and
`WM_DESTROY`; it does not replace the synchronous native window procedure.

Register resource handling before `start()`. As an alternative to
`mountAssets()`, use
`onResourceRequest((request) => Response | Promise<Response>)`. The default
filter is `https://app.local/*`; `resourceFilter` can select another origin.
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

In development, `start()` copies the package's DLL into the working directory
if `webview2.dll` is missing. Existing files are kept. No prepare step is needed.
This requires write permission and, when using the package from JSR, network
permission to download the DLL. An explicit `dllPath` is used as provided and
is not automatically populated. Compiled applications use the DLL placed by
the build helper.

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
helper includes the package's Worker entry directly with `deno compile --include`,
includes the assets, and copies the DLL matching the WebView2 package
beside the executable after a successful compile. Direct `deno compile main.ts`
needs the Worker entry included explicitly. No `.weapn-build` files are generated.
The build embeds FFI/read/env permissions by default; `permissions`
adds runtime permission flags, and `terminal: true` retains the console.

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

`workers` accepts JSR/HTTP/file URLs or local paths starting with `./`.
Resolve dependency names with `import.meta.resolve()` in your build script,
as shown above, so resolution uses your application's imports.
This example explicitly selects the default UI Worker;
it can also list other application Workers. Included modules are embedded at
build time and require no network access to load at runtime. The `/worker` export
is an executable Worker entry; `/ui-worker` exports the `startUIWorker` function.
For a manual build, use `--include jsr:@azulamb/weapn@0.1.0/worker` alongside
the application's entrypoint and asset includes. Custom Worker entries must be
ES modules (use an import/export, or `export {}` for a standalone entry).
`deno task test:build` verifies remote Worker embedding and DLL copying on Windows.

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

For the original sample, run this command from `weapn/sample/`.
The DLL is copied automatically when missing during development, and the build
places it beside the executable.

```sh
deno task build
```

The original sample builds `app.exe`. Each sample has its own `deno.json`;
run `deno task start` and `deno task check` inside the sample directory.
`sample2` uses the Worker-backed API and `setVirtualHostNameToFolderMapping()`
to serve a physical `docs/` directory directly through WebView2. Register the
mapping before `start()`; paths are file URLs or paths relative to the working
directory. The default cross-origin access setting is `denyCors`.
This requires files on disk, so exe-embedded frontend assets should use
`mountAssets()` as shown in `sample3`. The original `sample` demonstrates the
legacy resource Worker API.

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
