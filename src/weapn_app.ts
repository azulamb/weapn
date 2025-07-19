import { WebViewWindow } from './webview_window.ts';
import { winApi } from './win_api.ts';
import { PREPARE_WEBVIEW2_DLL_OPTION, prepareWebview2DLL } from './webview2.ts';
import { isCompiled } from './support/compile.ts';
import { dirname, fromFileUrl, isAbsolute, join } from 'jsr:@std/path@^1.0.8';

export class WeapnApp {
  protected isCompiled: boolean;
  protected url: URL;
  protected win: WebViewWindow;

  constructor(importMetaUrl: URL) {
    this.url = importMetaUrl;
    this.isCompiled = isCompiled(importMetaUrl);
    this.win = new WebViewWindow();
  }

  public setUserDataFolder(dir: string = '.\\.cache'): this {
    if (!isAbsolute(dir)) {
      const baseDir = this.compiled
        ? dirname(winApi.kernel.GetModuleFileName())
        : dirname(fromFileUrl(this.url));
      console.log(this.url);
      console.log(baseDir);
      dir = join(baseDir, dir);
    }
    winApi.user.MessageBoxEx(null, `${this.compiled} ${dir}`, 'title');
    Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', dir);
    return this;
  }

  public get compiled(): boolean {
    return this.isCompiled;
  }

  public get window() {
    return this.win;
  }

  public get webview2() {
    return this.win.webview2;
  }

  public async init(
    option?: {
      webView2DllPath?: string;
    } & PREPARE_WEBVIEW2_DLL_OPTION,
  ) {
    const hInstance = winApi.kernel.GetModuleHandle();
    this.win.init(hInstance);

    const webView2DllPath = option?.webView2DllPath || './webview2.dll';
    const dllInfo = await prepareWebview2DLL(webView2DllPath, option);
    console.log(dllInfo);
    this.win.loadDll(dllInfo.path);

    this.win.initWindow();
    this.win.createWindow();
    this.win.initWebView();

    this.win.show();

    const message = winApi.create.message();
    while (winApi.user.GetMessage(message.pointer, null, 0, 0)) {
      winApi.user.TranslateMessage(message.pointer);
      winApi.user.DispatchMessage(message.pointer);
      if (this.win.isPrepared()) {
        break;
      }
    }
  }

  public run() {
    console.log('Start loop.');
    const message = winApi.create.message();
    while (winApi.user.GetMessage(message.pointer, null, 0, 0)) {
      winApi.user.TranslateMessage(message.pointer);
      winApi.user.DispatchMessage(message.pointer);
    }
    console.log('End');
  }
}
