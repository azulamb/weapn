import { winApi, type WindowClassEx } from './libs/win_api.ts';
import { createWebView2 } from './libs/webview2.ts';
import { EventRegistrationToken } from './structs/event_registration_token.ts';
import type { WebView2 } from './libs/webview2.ts';
import type {
  HICON,
  HINSTANCE,
  HRESULT,
  HWND,
  LPARAM,
  LPVOID,
  PBYTE,
  UINT,
  WPARAM,
} from './libs/win_api.ts';
import { LoadMultiIconFromIconGroupResource } from './support/icon_loader.ts';
import type { WeapnLogger } from './types.ts';
type WEB_VIEW_WINDOW_STATUS = 'PREPARE' | 'RUNNING';

export class WebViewWindow {
  protected logger: WeapnLogger;

  protected style: number;
  protected styleEx: number;
  protected windowClassEx: WindowClassEx;
  protected hWindow: HWND = null;
  protected hIcons: (HICON | null)[] = [null, null]; // SmallIcon, BigIcon
  protected iconResource: (PBYTE | undefined)[] = [];

  protected _webview2!: WebView2;
  protected token: EventRegistrationToken;
  protected status: WEB_VIEW_WINDOW_STATUS = 'PREPARE';

  /**
   * @param logger Logger instance to log messages.
   */
  constructor(logger: WeapnLogger) {
    this.logger = logger;

    this.token = new EventRegistrationToken();

    this.style = winApi.create.windowStyle({
      WS_VISIBLE: true,
      WS_OVERLAPPEDWINDOW: true,
    });

    this.styleEx = winApi.create.windowStyleEx({});

    this.windowClassEx = winApi.create.windowClassEx();

    try {
      const iconDirectory = LoadMultiIconFromIconGroupResource('MAINICON');
      for (const icon of iconDirectory) {
        if (icon.width === 16 && icon.height === 16) {
          this.hIcons[0] = winApi.user.CreateIconFromResourceEx(
            Deno.UnsafePointer.of(icon.buffer),
            icon.buffer.byteLength,
          );
          this.logger.info('Load icon[small]: From resource MAINICON');
        } else if (icon.width === 32 && icon.height === 32) {
          this.hIcons[1] = winApi.user.CreateIconFromResourceEx(
            Deno.UnsafePointer.of(icon.buffer),
            icon.buffer.byteLength,
          );
          this.logger.info('Load icon[big]: From resource MAINICON');
        }
      }
    } catch (_error) {
      this.logger.warn('Failed to load icon from resource MAINICON');
    }
  }

  /**
   * Check if the WebView2 is prepared.
   * @returns true if the WebView2 is prepared.
   */
  public isPrepared(): boolean {
    return this.status === 'RUNNING';
  }

  /**
   * Initialize the WebView2 window.
   * @param hInstance The instance handle of the application.
   * @returns The WebViewWindow instance.
   */
  public init(hInstance: HINSTANCE): this {
    // TODO: Set Original WindowProc

    this.windowClass.hInstance = hInstance;
    this.windowClass.style = winApi.create.classStyle({
      CS_HREDRAW: true,
      CS_VREDRAW: true,
    });

    // Windowproc
    this.windowClass.setWindowProcedure(
      (hWnd: HWND, Msg: UINT, wParam: WPARAM, lParam: LPARAM) => {
        switch (Msg) {
          case winApi.windowMassage.WM_CREATE:
            this.logger.log('Create window:');
            break;
          case winApi.windowMassage.WM_DESTROY:
            this.logger.log('Destroy window:');
            winApi.user.PostQuitMessage(0);
            break;
          case winApi.windowMassage.WM_SIZE:
            this.onResizeScreen();
            break;
        }
        return winApi.user.DefWindowProc(hWnd, Msg, wParam, lParam);
      },
    );

    //this.windowClassEx.hCursor
    this.windowClass.hbrBackground = Deno.UnsafePointer.create(BigInt(5 + 1));

    this.windowClass.cbClsExtra = 0;
    this.windowClass.cbWndExtra = 0;
    this.windowClass.setClassName('WeapnAppWindow');

    // Big icon.
    if (this.hIcons[1]) {
      this.windowClass.hIcon = this.hIcons[1];
    } else {
      // Set deno icon. (Development mode.)
      this.windowClass.hIcon = winApi.user.LoadIcon(
        hInstance,
        winApi.macro.MAKEINTRESOURCE(1n),
      );
    }

    // Small icon.
    if (this.hIcons[0]) {
      this.windowClass.hIcon = this.hIcons[0];
    } else {
      // Set deno icon. (Development mode.)
      this.windowClass.hIconSm = winApi.user.LoadIcon(
        hInstance,
        winApi.macro.MAKEINTRESOURCE(1n),
      );
    }

    return this;
  }

  /**
   * Get the window class.
   * @returns The WindowClassEx.
   */
  get windowClass(): WindowClassEx {
    return this.windowClassEx;
  }

  /**
   * Get the window handle.
   * @returns The HWND.
   */
  get windowHandle(): HWND {
    return this.hWindow;
  }

  /**
   * Set the user data folder for WebView2.
   * @param dir The directory path to set as the user data folder.
   * @returns The WebViewWindow instance.
   */
  public initWindow(): this {
    // Register WindowClassEx
    const result = winApi.user.RegisterClassEx(this.windowClass.pointer);
    if (!result) {
      throw new Error(
        `Failure RegisterClassEx. [GetLastError=${winApi.kernel.GetLastError()}]`,
      );
    }
    return this;
  }

  /**
   * Create the window.
   * @returns The WebViewWindow instance.
   */
  public createWindow(): this {
    this.hWindow = winApi.user.CreateWindowEx(
      this.styleEx,
      this.windowClass.lpszClassName,
      winApi.create.stringPointer('test'),
      this.style,
      winApi.constant.CW_USEDEFAULT,
      winApi.constant.CW_USEDEFAULT,
      winApi.constant.CW_USEDEFAULT,
      winApi.constant.CW_USEDEFAULT,
      null,
      null,
    );
    if (this.windowHandle === null) {
      throw new Error('Failure CreateWindowEx');
    }
    return this;
  }

  public show() {}

  /**
   * Get the WebView2 instance.
   * @returns The WebView2 instance.
   */
  public get webview2() {
    return this._webview2;
  }

  /**
   * Load the WebView2 DLL.
   * @param dllPath The path to the WebView2 DLL.
   * @returns The WebView2 instance.
   */
  public loadDll(dllPath?: string): WebView2 | null {
    this._webview2 = createWebView2(dllPath);
    return this.webview2;
  }

  /**
   * Initialize the WebView2.
   * @returns The WebViewWindow instance.
   */
  public initWebView(): this {
    this.logger.info('Init WebView:');
    //this.webview2Connector = this.webview2.CreateWebView2Connector(null);
    this.webview2.CreateCoreWebView2EnvironmentWithOptions(
      null,
      null,
      null,
      (
        errorCode: HRESULT,
        createdEnvironment: LPVOID,
      ) => {
        return this.createWebView(errorCode, createdEnvironment);
      },
    );
    return this;
  }

  /**
   * Create the WebView2 controller.
   * @param _errorCode The error code from the WebView2 creation.
   * @param _createdEnvironment The created environment pointer.
   * @returns The HRESULT indicating success or failure.
   */
  public createWebView(
    _errorCode: HRESULT,
    _createdEnvironment: LPVOID,
  ): number {
    return this.webview2.CreateCoreWebView2Controller(
      this.windowHandle,
      (
        _errorCode: HRESULT,
        controller: LPVOID,
      ) => {
        if (controller !== null) {
          this.webview2.InitControllers(controller);
          this.webview2.CoreWebView2();
          /*this.webview2.add_RasterizationScaleChanged(
            this.webview2Connector,
            CallbackAddRasterizationScaleChanged,
            this.token.pointer
          );*/
        }
        this.logger.info('CreateCoreWebView2Controller: created');

        this.webview2.Settings();
        this.webview2.InitSettings();

        this.onResizeScreen();

        this.webview2.IsScriptEnabled = true;
        this.webview2.IsWebMessageEnabled = true;
        this.webview2.AreDefaultScriptDialogsEnabled = true;
        this.webview2.AreDevToolsEnabled = true;
        this.webview2.IsStatusBarEnabled = true;
        this.webview2.AreDefaultContextMenusEnabled = true;
        this.webview2.AreHostObjectsAllowed = true;
        this.webview2.IsBuiltInErrorPageEnabled = true;
        this.webview2.IsZoomControlEnabled = true;

        //this.webview2.Navigate('https://www.google.co.jp/');
        this.status = 'RUNNING';

        this.logger.info('CreateCoreWebView2Controller: end');
        return 0;
      },
    );
  }

  protected onResizeScreen() {
    this.logger.info('OnResizeScreen:');
    if (!this.webview2) {
      return;
    }
    const bounds = winApi.create.rect();
    winApi.user.GetClientRect(this.windowHandle, bounds.pointer);
    this.webview2.Bounds = bounds;
  }

  /**
   * Set the window icon.
   * @param smallIcon The small icon image data. (16x16)
   * @param bigIcon The big icon image data. (32x32)
   * @returns The WebViewWindow instance.
   */
  public setIcon(smallIcon?: Uint8Array, bigIcon?: Uint8Array): this {
    [smallIcon, bigIcon].forEach((icon, index) => {
      if (!icon) {
        return;
      }
      this.iconResource[index] = Deno.UnsafePointer.of(icon);
      this.hIcons[index] = winApi.user.CreateIconFromResourceEx(
        this.iconResource[index],
        icon.byteLength,
        true,
      );
      if (!this.isPrepared()) {
        return;
      }
      winApi.user.SendMessage(
        this.windowHandle,
        winApi.windowMassage.WM_SETICON,
        Deno.UnsafePointer.create(BigInt(index)), // ICON_SMALL = 0, ICON_BIG = 1
        this.hIcons[index],
      );
    });
    return this;
  }
}
