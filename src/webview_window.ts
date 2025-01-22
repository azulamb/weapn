import { winApi, WindowClassEx } from './win_api.ts';
import { createWebView2 } from './webview2.ts';
import { EventRegistrationToken } from './structs/event_registration_token.ts';
import type { WEBVIEW2_FUNCS } from './webview2.ts';

const TRUE = 1;

export class WebViewWindow {
  protected style: number;
  protected styleEx: number;
  protected windowClassEx: WindowClassEx;
  protected windowHandle!: HWND;
  protected webview2!: Deno.DynamicLibrary<WEBVIEW2_FUNCS>;
  protected webview2Connector!: Deno.PointerValue;
  protected token: EventRegistrationToken;

  public constructor(hInstance: HINSTANCE) {
    this.windowClassEx = winApi.create.windowClassEx();
    this.style = winApi.create.windowStyle({
      WS_VISIBLE: true,
      WS_OVERLAPPEDWINDOW: true,
    });
    this.token = new EventRegistrationToken();

    this.windowClass.hInstance = hInstance;
    this.windowClass.style = winApi.create.classStyle({
      CS_HREDRAW: true,
      CS_VREDRAW: true,
    });

    // Windowproc
    this.windowClass.setWindowProcedure((hWnd: HWND, Msg: UINT, wParam: WPARAM, lParam: LPARAM) => {
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
    });
    //this.windowClassEx.hCursor
    this.windowClass.hbrBackground = Deno.UnsafePointer.create(BigInt(5 + 1));

    this.windowClass.cbClsExtra = 0;
    this.windowClass.cbWndExtra = 0;
    //this.windowClassEx.lpszMenuName
    this.windowClass.setClassName('WeapnAppWindow');
    // Set deno icon.
    this.windowClass.hIcon = winApi.user.LoadIcon(hInstance, winApi.macro.MAKEINTRESOURCE(1n));
    this.windowClass.hIconSm = winApi.user.LoadIcon(hInstance, winApi.macro.MAKEINTRESOURCE(1n));

    this.styleEx = winApi.create.windowStyleEx({});
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
      throw new Error(`Failure RegisterClassEx. [GetLastError=${winApi.kernel.GetLastError()}]`);
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

  public loadDll(dllPath?: string) {
    this.webview2 = createWebView2(dllPath);
    return this.webview2;
  }

  public initWebView() {
    console.log('initWebView');
    this.webview2Connector = this.webview2.symbols.CreateWebView2Connector(null);
    const callback = new Deno.UnsafeCallback(
      {
        parameters: [
          winApi.winTypes.HRESULT.ffi, // HRESULT errorCode,
          'pointer', // ICoreWebView2Environment *createdEnvironment
        ],
        result: winApi.winTypes.HRESULT.ffi,
      },
      (
        errorCode: HRESULT,
        createdEnvironment: LPVOID,
      ) => {
        console.log(errorCode);
        return this.createWebView(errorCode, createdEnvironment);
      },
    );
    this.webview2.symbols._CreateCoreWebView2EnvironmentWithOptions(
      this.webview2Connector,
      null,
      null,
      null,
      callback.pointer,
    );
  }

  public createWebView(
    _errorCode: HRESULT,
    _createdEnvironment: LPVOID,
  ) {
    const callback = new Deno.UnsafeCallback(
      {
        parameters: [
          winApi.winTypes.HRESULT.ffi, // HRESULT errorCode,
          'pointer', // ICoreWebView2Controller* controller
        ],
        result: winApi.winTypes.HRESULT.ffi,
      },
      (
        _errorCode: HRESULT,
        controller: LPVOID,
      ) => {
        if (controller !== null) {
          this.webview2.symbols.InitControllers(this.webview2Connector, controller);
          this.webview2.symbols.get_CoreWebView2(this.webview2Connector);
          /*this.webview2.add_RasterizationScaleChanged(
            this.webview2Connector,
            CallbackAddRasterizationScaleChanged,
            this.token.pointer
          );*/
        }

        this.webview2.symbols.get_Settings(this.webview2Connector);
        this.webview2.symbols.InitSettings(this.webview2Connector);

        this.onResizeScreen();

        this.webview2.symbols.put_IsScriptEnabled(this.webview2Connector, TRUE);
        this.webview2.symbols.put_IsWebMessageEnabled(this.webview2Connector, TRUE);
        this.webview2.symbols.put_AreDefaultScriptDialogsEnabled(this.webview2Connector, TRUE);
        this.webview2.symbols.put_AreDevToolsEnabled(this.webview2Connector, TRUE);
        this.webview2.symbols.put_IsStatusBarEnabled(this.webview2Connector, TRUE);
        this.webview2.symbols.put_AreDefaultContextMenusEnabled(this.webview2Connector, TRUE);
        this.webview2.symbols.put_AreHostObjectsAllowed(this.webview2Connector, TRUE);
        this.webview2.symbols.put_IsBuiltInErrorPageEnabled(this.webview2Connector, TRUE);
        this.webview2.symbols.put_IsZoomControlEnabled(this.webview2Connector, TRUE);

        this.webview2.symbols.Navigate(
          this.webview2Connector,
          winApi.create.stringPointer('https://www.google.co.jp/'),
        );

        return 0;
      },
    );
    return this.webview2.symbols.CreateCoreWebView2Controller(
      this.webview2Connector,
      this.windowHandle,
      callback.pointer,
    );
  }

  protected onResizeScreen() {
    console.log('OnResizeScreen');
    if (!this.webview2) {
      return;
    }
    const bounds = winApi.create.rect();
    winApi.user.GetClientRect(this.windowHandle, bounds.pointer);
    this.webview2.symbols.put_Bounds(this.webview2Connector, bounds.data);
  }
}
