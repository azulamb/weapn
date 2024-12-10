import { winApi } from './win_api.ts';

export const version = 'webview2-1.0.1661.34';

export const webview2 = Deno.dlopen(
  'webview2.dll',
  {
    _CompareBrowserVersions: { // https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/win32/webview2-idl
      parameters: [
        winApi.winTypes.LPCWSTR.ffi, // PCWSTR version1
        winApi.winTypes.LPCWSTR.ffi, // PCWSTR version2
        'pointer', // int* result
      ],
      result: winApi.winTypes.HRESULT.ffi,
    },
    _CreateCoreWebView2Environment: { // https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/win32/webview2-idl
      parameters: [
        'pointer', // ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler * environmentCreatedHandler
      ],
      result: winApi.winTypes.HRESULT.ffi,
    },
    _CreateCoreWebView2EnvironmentWithOptions: { // https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/win32/webview2-idl
      parameters: [
        winApi.winTypes.LPCWSTR.ffi, // PCWSTR browserExecutableFolder
        winApi.winTypes.LPCWSTR.ffi, // PCWSTR userDataFolder
        'pointer', // ICoreWebView2EnvironmentOptions * environmentOptions
        'function', // HRESULT(*callback)(HRESULT result, ICoreWebView2Environment* env)
      ],
      result: winApi.winTypes.HRESULT.ffi,
    },
    _GetAvailableCoreWebView2BrowserVersionString: { // https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/win32/webview2-idl
      parameters: [
        winApi.winTypes.LPCWSTR.ffi, // PCWSTR browserExecutableFolder
        'pointer', // LPWSTR * versionInfo
        'pointer', // ICoreWebView2EnvironmentOptions * environmentOptions
        'function', // ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler * environmentCreatedHandler
      ],
      result: winApi.winTypes.HRESULT.ffi,
    },
    // Env
    CreateCoreWebView2Controller: { // https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/win32/icorewebview2environment
      parameters: [
        'pointer', // ICoreWebView2Environment* env
        winApi.winTypes.HWND.ffi, // HWND parentWindow
        'pointer', // ICoreWebView2CreateCoreWebView2ControllerCompletedHandler * handler
      ],
      result: winApi.winTypes.HRESULT.ffi,
    },
    // Original
    CreateWebView2Connector: {
      parameters: [
        'pointer', // ICoreWebView2Environment* env
      ],
      result: 'pointer', // WebView2Connector* webview2
    },
    InitControllers: {
      parameters: [
        'pointer', // WebView2Connector* webview2
        'pointer', // ICoreWebView2Controller* controller
      ],
      result: 'pointer', // WebView2Connector* webview2
    },
  },
);
