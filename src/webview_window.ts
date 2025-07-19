import { winApi, WindowClassEx } from './win_api.ts';
import { createWebView2 } from './webview2.ts';
import { EventRegistrationToken } from './structs/event_registration_token.ts';
import type { WebView2 } from './webview2.ts';
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
} from './win_api.ts';
import { IconDirectory } from './icon.ts';
import { LoadMultiIconFromIconGroupResource } from './support/icon_loader.ts';
type WEB_VIEW_WINDOW_STATUS = 'PREPARE' | 'RUNNING';

export class WebViewWindow {
  protected style: number;
  protected styleEx: number;
  protected windowClassEx: WindowClassEx;
  protected windowHandle!: HWND;
  protected hIcons: (HICON | null)[] = [null, null]; // SmallIcon, BigIcon
  protected iconResource: (PBYTE | undefined)[] = [];

  protected _webview2!: WebView2;
  protected token: EventRegistrationToken;
  protected prepared: Promise<void>;
  protected prepareFuncs!: {
    success: () => void;
    failure: (error: Error) => void;
  };
  protected status: WEB_VIEW_WINDOW_STATUS = 'PREPARE';

  constructor() {
    this.token = new EventRegistrationToken();
    this.prepared = new Promise<void>((success, failure) => {
      this.prepareFuncs = {
        success: success,
        failure: failure,
      };
    });

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
        } else if (icon.width === 32 && icon.height === 32) {
          this.hIcons[1] = winApi.user.CreateIconFromResourceEx(
            Deno.UnsafePointer.of(icon.buffer),
            icon.buffer.byteLength,
          );
        }
      }
    } catch (_error) {
      console.warn('Failed to load icon from resource MAINICON');
    }
  }

  public isPrepared() {
    return this.status === 'RUNNING';
  }

  public init(hInstance: HINSTANCE) {
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
            console.log('Create');
            break;
          case winApi.windowMassage.WM_DESTROY:
            console.log('Destroy');
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
    //this.windowClassEx.lpszMenuName
    this.windowClass.setClassName('WeapnAppWindow');

    console.log(this.hIcons);
    // Big icon.
    if (this.hIcons[1]) {
      console.log(this.hIcons[1]);
      this.windowClass.hIcon = this.hIcons[1];
    } else {
      // Set deno icon. (Run mode.)
      this.windowClass.hIcon = winApi.user.LoadIcon(
        hInstance,
        winApi.macro.MAKEINTRESOURCE(1n),
      );
    }

    // Small icon.
    if (this.hIcons[0]) {
      console.log(this.hIcons[0]);
      this.windowClass.hIcon = this.hIcons[0];
    } else {
      // Set deno icon. (Run mode.)
      this.windowClass.hIconSm = winApi.user.LoadIcon(
        hInstance,
        winApi.macro.MAKEINTRESOURCE(1n),
      );
    }
  }

  public onPrepared() {
    return this.prepared;
  }

  get windowClass() {
    return this.windowClassEx;
  }

  getWindowHandle(): HWND {
    return this.windowHandle;
  }

  public initWindow() {
    // Register WindowClassEx
    const result = winApi.user.RegisterClassEx(this.windowClass.pointer);
    if (!result) {
      throw new Error(
        `Failure RegisterClassEx. [GetLastError=${winApi.kernel.GetLastError()}]`,
      );
    }
  }

  public createWindow() {
    this.windowHandle = winApi.user.CreateWindowEx(
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
  }

  public show() {}

  public get webview2() {
    return this._webview2;
  }

  public loadDll(dllPath?: string) {
    this._webview2 = createWebView2(dllPath);
    return this.webview2;
  }

  public initWebView() {
    console.log('initWebView');
    //this.webview2Connector = this.webview2.CreateWebView2Connector(null);
    this.webview2.CreateCoreWebView2EnvironmentWithOptions(
      null,
      null,
      null,
      (
        errorCode: HRESULT,
        createdEnvironment: LPVOID,
      ) => {
        console.log(errorCode);
        return this.createWebView(errorCode, createdEnvironment);
      },
    );
  }

  public createWebView(
    _errorCode: HRESULT,
    _createdEnvironment: LPVOID,
  ) {
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
        console.log('CreateCoreWebView2Controller: created');

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
        this.prepareFuncs.success();
        this.status = 'RUNNING';

        console.log('CreateCoreWebView2Controller: end');
        return 0;
      },
    );
  }

  protected onResizeScreen() {
    console.log('OnResizeScreen');
    if (!this.webview2) {
      return;
    }
    const bounds = winApi.create.rect();
    winApi.user.GetClientRect(this.windowHandle, bounds.pointer);
    this.webview2.Bounds = bounds;
  }

  public setIcon(smallIcon?: Uint8Array, bigIcon?: Uint8Array) {
    [smallIcon, bigIcon].forEach((icon, index) => {
      if (!icon) {
        return;
      }
      console.log(icon);
      this.iconResource[index] = Deno.UnsafePointer.of(icon);
      console.log(this.iconResource[index], icon.byteLength);
      this.hIcons[index] = winApi.user.CreateIconFromResourceEx(
        this.iconResource[index],
        icon.byteLength,
        true,
      );
      console.log(`err: ${winApi.kernel.GetLastError()}`);
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
  }
}
