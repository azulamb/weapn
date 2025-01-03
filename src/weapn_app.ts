import { WebViewWindow } from './webview_window.ts';
import { winApi } from './win_api.ts';

export class WeapnApp {
  protected win!: WebViewWindow;

  public init(option?: {
    webView2DllPath?: string;
  }) {
    this.win = new WebViewWindow(winApi.kernel.GetModuleHandle());
    this.win.initWindow();

    //this.win.getWindowState()
    const exStyle = 0x00080000; // WS_EX_LAYERED
    //this.win.windowClass.

    /*switch ( this->settings->Display() )
		{
		case WEBAPP_DISPLAY::FULLSCREEN:
			MONITORINFOEX display = WinAPI::Display::GetFromPoint();
			state->x = display.rcWork.left;
			state->y = display.rcWork.top;
			state->width = abs( display.rcWork.right - display.rcWork.left );
			state->height = abs( display.rcWork.bottom - display.rcWork.top );
		case WEBAPP_DISPLAY::MINIMAL_UI:
			state->style = WS_VISIBLE | WS_POPUP;
			break;
		case WEBAPP_DISPLAY::STANDALONE:
			state->style = WS_VISIBLE | WS_OVERLAPPEDWINDOW;
			break;
		default: break;
			state->style = WS_VISIBLE | WS_OVERLAPPEDWINDOW;
		} */
    //const style = 0x10000000 | 0x00000000 | 0x00C00000 | 0x00080000 | 0x00040000 | 0x00020000 | 0x00010000; //WS_VISIBLE | WS_OVERLAPPEDWINDOW
    // Window style
    // Cursor
    // Title
    //this.win.setTitle()

    this.win.register();

    this.win.create();

    this.win.initWebView(option?.webView2DllPath);
  }

  public run() {
    this.win.show();

    const windowHandle = this.win.getWindowHandle();

    const message = winApi.create.message();
    while (winApi.user.GetMessage(message.pointer, windowHandle, 0, 0)) {
      winApi.user.DispatchMessage(message.pointer);
    }

    //return message.data.wParam
  }
}
