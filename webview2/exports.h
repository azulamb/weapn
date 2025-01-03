#pragma once
#include "./WebView2.hpp"

#define EXPORT extern "C" __declspec(dllexport)

/**
* Global
*/

EXPORT HRESULT _CreateCoreWebView2Environment(
	WebView2Connector* webview2,
	HRESULT(*callback)(HRESULT, ICoreWebView2Environment*)
);

EXPORT HRESULT _CreateCoreWebView2EnvironmentWithOptions(
	WebView2Connector* webview2,
	PCWSTR browserExecutableFolder,
	PCWSTR userDataFolder,
	ICoreWebView2EnvironmentOptions* environmentOptions,
	HRESULT(*callback)(HRESULT result, ICoreWebView2Environment* env)
);

EXPORT HRESULT _CompareBrowserVersions(
	PCWSTR version1,
	PCWSTR version2,
	int* result
);

EXPORT HRESULT _GetAvailableCoreWebView2BrowserVersionString(
	PCWSTR browserExecutableFolder,
	LPWSTR* versionInfo
);

/**
* Original
*/

EXPORT WebView2Connector* CreateWebView2Connector(
	ICoreWebView2Environment* env
);

EXPORT WebView2Connector* SetWebview2Environment(
	WebView2Connector* webview2,
	ICoreWebView2Environment* env
);

EXPORT WebView2Connector* InitSettings(WebView2Connector* webview2);

EXPORT WebView2Connector* InitControllers(
	WebView2Connector* webview2,
	ICoreWebView2Controller* controller
);

/**
* ICoreWebView2Environment
*/

EXPORT HRESULT CreateCoreWebView2Controller(
	WebView2Connector* webview2,
	HWND hWnd,
	HRESULT(*callback)(HRESULT, ICoreWebView2Controller*)
);

/**
* ICoreWebView2Settings
*/
EXPORT HRESULT get_IsScriptEnabled(WebView2Connector* webview2, BOOL* isScriptEnabled);

EXPORT HRESULT put_IsScriptEnabled(WebView2Connector* webview2, BOOL isScriptEnabled);

EXPORT HRESULT get_IsWebMessageEnabled(WebView2Connector* webview2, BOOL* isWebMessageEnabled);

EXPORT HRESULT put_IsWebMessageEnabled(WebView2Connector* webview2, BOOL isWebMessageEnabled);

EXPORT HRESULT get_AreDefaultScriptDialogsEnabled(WebView2Connector* webview2, BOOL* areDefaultScriptDialogsEnabled);

EXPORT HRESULT put_AreDefaultScriptDialogsEnabled(WebView2Connector* webview2, BOOL areDefaultScriptDialogsEnabled);

EXPORT HRESULT get_IsStatusBarEnabled(WebView2Connector* webview2, BOOL* isStatusBarEnabled);

EXPORT HRESULT put_IsStatusBarEnabled(WebView2Connector* webview2, BOOL isStatusBarEnabled);

EXPORT HRESULT get_AreDevToolsEnabled(WebView2Connector* webview2, BOOL* areDevToolsEnabled);

EXPORT HRESULT put_AreDevToolsEnabled(WebView2Connector* webview2, BOOL areDevToolsEnabled);

EXPORT HRESULT get_AreDefaultContextMenusEnabled(WebView2Connector* webview2, BOOL* enabled);

EXPORT HRESULT put_AreDefaultContextMenusEnabled(WebView2Connector* webview2, BOOL enabled);

EXPORT HRESULT get_AreHostObjectsAllowed(WebView2Connector* webview2, BOOL* allowed);

EXPORT HRESULT put_AreHostObjectsAllowed(WebView2Connector* webview2, BOOL allowed);

EXPORT HRESULT get_IsZoomControlEnabled(WebView2Connector* webview2, BOOL* enabled);

EXPORT HRESULT put_IsZoomControlEnabled(WebView2Connector* webview2, BOOL enabled);

EXPORT HRESULT get_IsBuiltInErrorPageEnabled(WebView2Connector* webview2, BOOL* enabled);

EXPORT HRESULT put_IsBuiltInErrorPageEnabled(WebView2Connector* webview2, BOOL enabled);

/**
* ICoreWebView2Settings2
*/
EXPORT HRESULT get_UserAgent(WebView2Connector* webview2, LPWSTR* userAgent);

EXPORT HRESULT put_UserAgent(WebView2Connector* webview2, LPCWSTR userAgent);

/**
* ICoreWebView2Settings3
*/
EXPORT HRESULT get_AreBrowserAcceleratorKeysEnabled(WebView2Connector* webview2, BOOL* areBrowserAcceleratorKeysEnabled);

EXPORT HRESULT put_AreBrowserAcceleratorKeysEnabled(WebView2Connector* webview2, BOOL areBrowserAcceleratorKeysEnabled);

/**
* ICoreWebView2Settings4
*/
EXPORT HRESULT get_IsPasswordAutosaveEnabled(WebView2Connector* webview2, BOOL* value);

EXPORT HRESULT put_IsPasswordAutosaveEnabled(WebView2Connector* webview2, BOOL value);

EXPORT HRESULT get_IsGeneralAutofillEnabled(WebView2Connector* webview2, BOOL* value);

EXPORT HRESULT put_IsGeneralAutofillEnabled(WebView2Connector* webview2, BOOL value);

/**
* ICoreWebView2Settings5
*/
EXPORT HRESULT get_IsPinchZoomEnabled(WebView2Connector* webview2, /* [retval][out] */ BOOL* enabled);

EXPORT HRESULT put_IsPinchZoomEnabled(WebView2Connector* webview2, /* [in] */ BOOL enabled);

/**
* ICoreWebView2Settings6
*/
EXPORT HRESULT get_IsSwipeNavigationEnabled(WebView2Connector* webview2, /* [retval][out] */ BOOL* enabled);

EXPORT HRESULT put_IsSwipeNavigationEnabled(WebView2Connector* webview2, /* [in] */ BOOL enabled);

/*
* ICoreWebView2Controller
*/

EXPORT HRESULT add_AcceleratorKeyPressed(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2AcceleratorKeyPressedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_AcceleratorKeyPressed(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT get_Bounds(
	WebView2Connector* webview2,
	/* [retval][out] */ RECT* bounds
);

EXPORT HRESULT put_Bounds(
	WebView2Connector* webview2,
	/* [in] */ RECT bounds
);

EXPORT HRESULT Close(WebView2Connector* webview2);

EXPORT HRESULT get_CoreWebView2(WebView2Connector* webview2);

EXPORT HRESULT add_GotFocus(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_GotFocus(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT get_IsVisible(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* isVisible
);

EXPORT HRESULT put_IsVisible(
	WebView2Connector* webview2,
	/* [in] */ BOOL isVisible
);

EXPORT HRESULT add_LostFocus(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_LostFocus(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT MoveFocus(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_MOVE_FOCUS_REASON reason
);

EXPORT HRESULT add_MoveFocusRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2MoveFocusRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_MoveFocusRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT NotifyParentWindowPositionChanged(WebView2Connector* webview2);

EXPORT HRESULT get_ParentWindow(
	WebView2Connector* webview2,
	/* [retval][out] */ HWND* parentWindow
);

EXPORT HRESULT put_ParentWindow(
	WebView2Connector* webview2,
	/* [in] */ HWND parentWindow
);

EXPORT HRESULT SetBoundsAndZoomFactor(
	WebView2Connector* webview2,
	/* [in] */ RECT bounds,
	/* [in] */ double zoomFactor
);

EXPORT HRESULT get_ZoomFactor(
	WebView2Connector* webview2,
	/* [retval][out] */ double* zoomFactor
);

EXPORT HRESULT put_ZoomFactor(
	WebView2Connector* webview2,
	/* [in] */ double zoomFactor
);

EXPORT HRESULT add_ZoomFactorChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_ZoomFactorChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

/*
* ICoreWebView2Controller2
*/

EXPORT HRESULT get_DefaultBackgroundColor(
	WebView2Connector* webview2,
	/* [retval][out] */ COREWEBVIEW2_COLOR* backgroundColor
);

EXPORT HRESULT put_DefaultBackgroundColor(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_COLOR backgroundColor
);

/*
* ICoreWebView2Controller3
*/

EXPORT HRESULT add_RasterizationScaleChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_RasterizationScaleChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT get_BoundsMode(
	WebView2Connector* webview2,
	/* [retval][out] */ COREWEBVIEW2_BOUNDS_MODE* boundsMode
);

EXPORT HRESULT put_BoundsMode(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_BOUNDS_MODE boundsMode
);

EXPORT HRESULT get_RasterizationScale(
	WebView2Connector* webview2,
	/* [retval][out] */ double* scale
);

EXPORT HRESULT put_RasterizationScale(
	WebView2Connector* webview2,
	/* [in] */ double scale
);

EXPORT HRESULT get_ShouldDetectMonitorScaleChanges(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* value
);

EXPORT HRESULT put_ShouldDetectMonitorScaleChanges(
	WebView2Connector* webview2,
	/* [in] */ BOOL value
);

/*
* ICoreWebView2Controller4
*/

EXPORT HRESULT get_AllowExternalDrop(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* value
);

EXPORT HRESULT put_AllowExternalDrop(
	WebView2Connector* webview2,
	/* [in] */ BOOL value
);

/**
* ICoreWebView2
*/

/* Development */

EXPORT HRESULT CallDevToolsProtocolMethod(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR methodName,
	/* [in] */ LPCWSTR parametersAsJson,
	/* [in] */ HRESULT(*callback)(/* [in] */ HRESULT, /* [in] */ LPCWSTR)
);

EXPORT HRESULT GetDevToolsProtocolEventReceiver(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR eventName,
	/* [retval][out] */ ICoreWebView2DevToolsProtocolEventReceiver** receiver
);

EXPORT HRESULT OpenDevToolsWindow(WebView2Connector* webview2);

/* Document */

EXPORT HRESULT add_DocumentTitleChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(/* [in] */ ICoreWebView2*, /* [in] */ IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_DocumentTitleChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT get_DocumentTitle(
	WebView2Connector* webview2,
	/* [retval][out] */ LPWSTR* title
);

/* History */

EXPORT HRESULT add_HistoryChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_HistoryChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

/* Message */

EXPORT HRESULT PostWebMessageAsJson(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR webMessageAsJson
);

EXPORT HRESULT PostWebMessageAsString(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR webMessageAsString
);

EXPORT HRESULT add_WebMessageReceived(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebMessageReceivedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_WebMessageReceived(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

/* Navigation */

EXPORT HRESULT Navigate(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR uri
);

EXPORT HRESULT add_NavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_NavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT add_NavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_NavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT NavigateToString(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR htmlContent
);

EXPORT HRESULT add_FrameNavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_FrameNavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT add_FrameNavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_FrameNavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

/* Permission */

EXPORT HRESULT add_PermissionRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2PermissionRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_PermissionRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

/* Script */

EXPORT HRESULT add_ScriptDialogOpening(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ScriptDialogOpeningEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_ScriptDialogOpening(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT AddScriptToExecuteOnDocumentCreated(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR javaScript,
	/* [in] */ HRESULT(*callback)(HRESULT, LPCWSTR)
);

EXPORT HRESULT RemoveScriptToExecuteOnDocumentCreated(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR id
);

EXPORT HRESULT ExecuteScript(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR javaScript,
	/* [in] */ HRESULT(*callback)(HRESULT, LPCWSTR)
);

EXPORT HRESULT AddHostObjectToScript(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR name,
	/* [in] */ VARIANT* object
);

EXPORT HRESULT RemoveHostObjectFromScript(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR name
);

/* Source */

EXPORT HRESULT get_Source(
	WebView2Connector* webview2,
	/* [retval][out] */ LPWSTR* uri
);

EXPORT HRESULT add_SourceChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2SourceChangedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_SourceChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

/* Operation */

EXPORT HRESULT Reload(WebView2Connector* webview2);

EXPORT HRESULT get_CanGoBack(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* canGoBack
);

EXPORT HRESULT get_CanGoForward(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* canGoForward
);

EXPORT HRESULT GoBack(WebView2Connector* webview2);

EXPORT HRESULT GoForward(WebView2Connector* webview2);

EXPORT HRESULT Stop(WebView2Connector* webview2);

/* Other */

EXPORT HRESULT add_ContentLoading(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ContentLoadingEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_ContentLoading(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT add_ProcessFailed(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ProcessFailedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_ProcessFailed(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT get_Settings(WebView2Connector* webview2);

EXPORT HRESULT CapturePreview(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_CAPTURE_PREVIEW_IMAGE_FORMAT imageFormat,
	/* [in] */ IStream* imageStream,
	/* [in] */ HRESULT(*callback)(HRESULT errorCode)
);

EXPORT HRESULT get_BrowserProcessId(
	WebView2Connector* webview2,
	/* [retval][out] */ UINT32* value
);

EXPORT HRESULT add_NewWindowRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NewWindowRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_NewWindowRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT add_ContainsFullScreenElementChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_ContainsFullScreenElementChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT get_ContainsFullScreenElement(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* containsFullScreenElement
);

EXPORT HRESULT add_WebResourceRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebResourceRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_WebResourceRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);

EXPORT HRESULT AddWebResourceRequestedFilter(
	WebView2Connector* webview2,
	/* [in] */ const LPCWSTR uri,
	/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
);

EXPORT HRESULT RemoveWebResourceRequestedFilter(
	WebView2Connector* webview2,
	/* [in] */ const LPCWSTR uri,
	/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
);

EXPORT HRESULT add_WindowCloseRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
);

EXPORT HRESULT remove_WindowCloseRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
);
