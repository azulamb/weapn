# weapn

## Environment

* Deno
  * `^2.4.2`
* @azulamb/webview2
  * https://jsr.io/@azulamb/webview2
  * webview2.dll and wrapper.
* @azulamb/winapi
  * https://jsr.io/@azulamb/winapi
  * Windows API wrapper.

## Build

### Prepare

Copy `webview2.dll` .

```sh
deno task prepare
```

## Exe

```sh
deno task build
```

`webview2.exe` is sample.

## Other

### TODO

* DLLのサイズとMD5
* DLLのバージョン指定
  * バージョンはライブラリのタグベース。
