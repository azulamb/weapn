import { WebViewWindow } from './webview_window.ts';
import { winApi } from './win_api.ts';

export class WeapnApp {
  protected win!: WebViewWindow;

  public init(option?: {
    webView2DllPath?: string;
  }) {
    const hInstance = winApi.kernel.GetModuleHandle();
    this.win = new WebViewWindow(hInstance);
    this.win.loadDll(option?.webView2DllPath);

    this.win.initWindow();
    this.win.createWindow();

    this.win.initWebView();
  }

  public run() {
    this.win.show();

    console.log('Start loop.');
    const message = winApi.create.message();
    while (winApi.user.GetMessage(message.pointer, null, 0, 0)) {
      winApi.user.TranslateMessage(message.pointer);
      winApi.user.DispatchMessage(message.pointer);
    }
    console.log('End');
  }
}
