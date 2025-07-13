# weapn

## Environment

* Deno
  * `^2.4.1`

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
* ビルドコマンド作成ツール
  * DLLをincludeするオプションの追加
  * フラグによってはincludeしなかったりWebからDLできるようにする
  * DLLのサイズとMD5チェックをする
