# 開発向け

## webview2

### プロジェクトの新規作成

VisualStudioの新バージョンがリリースされ、新規でプロジェクトを作る場合の初期設定

* 空のプロジェクトを作成
* cppファイルを追加
* Nugetでパッケージのインストール
  * `Microsoft.Web.WebView2`
  * `Microsoft.Windows.ImplementationLibrary`
* 設定の変更
  * 全般
    * 構成の種類
      * `ダイナミックリンクライブラリ(.dll)`
  * C/C++
    * コード生成
      * ランタイムライブラリ
        * Debug: `マルチスレッドデバッグ(/MTd)`
        * Release: `マルチスレッド(/MT)`
* 後述する `.vcproj` の編集

### vcprojの編集

https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/how-to/static

以下のように編集する。

```xml
  <ImportGroup Label="ExtensionTargets">
    <Import Project="packages\Microsoft.Web.WebView2.1.0.1661.34\build\native\Microsoft.Web.WebView2.targets" Condition="Exists('packages\Microsoft.Web.WebView2.1.0.1661.34\build\native\Microsoft.Web.WebView2.targets')" />
  </ImportGroup>
```

```xml
  <ImportGroup Label="ExtensionTargets">
    <Import Project="packages\Microsoft.Web.WebView2.1.0.1661.34\build\native\Microsoft.Web.WebView2.targets" Condition="Exists('packages\Microsoft.Web.WebView2.1.0.1661.34\build\native\Microsoft.Web.WebView2.targets')" />
  </ImportGroup>
  <PropertyGroup>
    <WebView2LoaderPreference>Static</WebView2LoaderPreference>
  </PropertyGroup>
```
