import { WebViewWindow } from './webview_window.ts';
import { winApi } from './win_api.ts';
import { PREPARE_WEBVIEW2_DLL_OPTION, prepareWebview2DLL } from './webview2.ts';

export class WeapnApp {
  protected win!: WebViewWindow;

  public get webview2() {
    return this.win.webview2;
  }

  public async init(
    option?: {
      webView2DllPath?: string;
    } & PREPARE_WEBVIEW2_DLL_OPTION,
  ) {
    const hInstance = winApi.kernel.GetModuleHandle();
    this.win = new WebViewWindow(hInstance);

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
