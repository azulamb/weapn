import { winApi, WindowClassEx } from './win_api.ts';
import { createWebView2 } from './webview2.ts';

export class WebViewWindow {
  protected style: number;
  protected styleEx: number;
  protected windowClassEx: WindowClassEx;
  protected windowHandle!: HWND;
  protected webview2!: Deno.DynamicLibrary<WEBVIEW2_FUNCS>;
  protected webview2Connector!: Deno.PointerValue;

  public constructor() {
    this.windowClassEx = winApi.create.windowClassEx();
    this.windowClass.style = 3; //CS_HREDRAW | CS_VREDRAW
    // Windowproc
    this.windowClass.cbClsExtra = 0;
    this.windowClass.cbWndExtra = 0;
    //this.windowClassEx.hCursor
    this.windowClass.hbrBackground = Deno.UnsafePointer.create(BigInt(5 + 1));
    //this.windowClassEx.lpszMenuName
    this.windowClass.setClassName('WeapnAppWindow');
    //this.windowClassEx.hIcon
    //this.windowClassEx.hIconSm
    this.style = winApi.create.windowStyle({
      WS_VISIBLE: true,
      WS_OVERLAPPEDWINDOW: true,
    });
    this.styleEx = 0;
  }

  get windowClass() {
    return this.windowClassEx;
  }

  getWindowHandle(): HWND {
    return this.windowHandle;
  }

  public init() {}

  public register() {
    winApi.user.RegisterClassEx(this.windowClassEx.pointer);
  }

  public create() {
    this.windowHandle = winApi.user.CreateWindowEx(
      this.styleEx,
      this.windowClass.lpszClassName,
      winApi.create.stringPointer('test'),
      this.style,
      winApi.constant.CW_USEDEFAULT,
      winApi.constant.CW_USEDEFAULT,
      winApi.constant.CW_USEDEFAULT,
      winApi.constant.CW_USEDEFAULT,
    );
  }

  public show() {}

  public initWebView() {
    this.webview2 = createWebView2();
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
        this.createWebView(errorCode, createdEnvironment);
        return errorCode;
      },
    );
    this.webview2.symbols._CreateCoreWebView2EnvironmentWithOptions(
      null,
      null,
      null,
      callback.pointer,
    );
  }

  public createWebView(
    _errorCode: HRESULT,
    createdEnvironment: LPVOID,
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
        errorCode: HRESULT,
        controller: LPVOID,
      ) => {
        if (controller) {
          this.webview2.symbols.InitControllers(this.webview2Connector, controller);
        }
        return errorCode;
      },
    );
    this.webview2Connector = this.webview2.symbols.CreateWebView2Connector(createdEnvironment);
    this.webview2.symbols.CreateCoreWebView2Controller(
      this.webview2Connector,
      this.windowHandle,
      callback.pointer,
    );
  }
}
