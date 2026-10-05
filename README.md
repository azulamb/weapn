# weapn

- [GitHub](https://github.com/azulamb/weapn)
- [JSR](https://jsr.io/@azulamb/weapn)
- Sample
  - ./sample/
  - ./sample2/
  - ./sample3/
  - [./sample4/](./sample4/) — Transparent window with a PNG drawn on canvas.

A Windows desktop framework for Deno and WebView2. Native UI runs on an internal
Worker, while application logic runs on the main thread. Frontend files can be
embedded in an executable and served without an HTTP server.

Requires Windows x64 and WebView2 Runtime.

## Environment

- Deno
  - `^2.9.7`
- @azulamb/webview2
  - https://jsr.io/@azulamb/webview2
  - webview2.dll and wrapper.
- @azulamb/winapi
  - https://jsr.io/@azulamb/winapi
  - Windows API wrapper.

## main.ts

```ts
import { WeapnApp } from '@azulamb/weapn/app';

const app = new WeapnApp(import.meta, {
  title: 'My app',
  width: 960,
  height: 640,
});
app.mountAssets(new URL('./docs/', import.meta.url));
await app.start();
await app.setUrl('https://app.example/index.html');
await app.closed;
```

Place frontend files in `docs/`. `width` and `height` specify the content size
in logical pixels, excluding the title bar and borders.

For a transparent mascot window, set `transparent: true` and
`decorations: false`. Keep HTML/CSS backgrounds transparent and use a canvas
with alpha enabled. `transparent` overrides `backgroundColor`.

## build.ts

```ts
import { build } from '@azulamb/weapn/build';

await build({
  entry: './main.ts',
  output: './dist/app.exe',
  assets: ['./docs/'],
});
```

```sh
deno add jsr:@azulamb/weapn
deno run --allow-read --allow-write --allow-ffi --allow-env --allow-net main.ts
deno run --allow-read --allow-write --allow-net --allow-run build.ts
```

Distribute `dist/app.exe` and `dist/webview2.dll`.

### TODO

- DLLのサイズと内容チェック
  - 古いなら更新等
- DLLのバージョン指定
  - バージョンはライブラリのタグベース。
- PostMessage（クライアント向け）のライブラリ追加
- ドキュメント
  - アイコンに関する説明の追加
  - PostMessageの説明
