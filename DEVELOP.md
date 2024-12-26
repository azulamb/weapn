# 開発向け

## webview2

VisualStudio 2022

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

### staticにする場合のvcprojの編集

メモ書き。後でちょっと考える。

https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/how-to/static

```xml
  <ImportGroup Label="ExtensionTargets">
    <Import Project="packages\Microsoft.Web.WebView2.1.0.2903.40\build\native\Microsoft.Web.WebView2.targets" Condition="Exists('packages\Microsoft.Web.WebView2.1.0.2903.40\build\native\Microsoft.Web.WebView2.targets')" />
    <Import Project="packages\Microsoft.Windows.ImplementationLibrary.1.0.240803.1\build\native\Microsoft.Windows.ImplementationLibrary.targets" Condition="Exists('packages\Microsoft.Windows.ImplementationLibrary.1.0.240803.1\build\native\Microsoft.Windows.ImplementationLibrary.targets')" />
  </ImportGroup>
```

の後に追加。

```xml
  <PropertyGroup>
    <WebView2LoaderPreference>Static</WebView2LoaderPreference>
  </PropertyGroup>
```
