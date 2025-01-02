#include "WebView2.hpp"

void Log(const WCHAR* message) {
#ifdef _DEBUG
	OutputDebugString(message);
	//wprintf(message);
#endif
}

/**
* Global
*/

EXPORT HRESULT _CreateCoreWebView2Environment(
	WebView2Connector* webview2,
	HRESULT(*callback)(HRESULT, ICoreWebView2Environment*)
) {
	Log(__FUNCTIONW__  L"\n");
	return ::CreateCoreWebView2Environment(
		Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
			[callback, webview2](HRESULT result, ICoreWebView2Environment* env) -> HRESULT {
				Log(__FUNCTIONW__  L"\n");
				webview2->setWebView2Environment(env);
				return callback(result, env);
			}
		).Get()
	);
}

EXPORT HRESULT _CreateCoreWebView2EnvironmentWithOptions(
	WebView2Connector* webview2,
	PCWSTR browserExecutableFolder,
	PCWSTR userDataFolder,
	ICoreWebView2EnvironmentOptions* environmentOptions,
	HRESULT(*callback)(HRESULT result, ICoreWebView2Environment* env)
) {
	Log(__FUNCTIONW__  L"\n");
	return ::CreateCoreWebView2EnvironmentWithOptions(
		browserExecutableFolder,
		browserExecutableFolder,
		environmentOptions,
		Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
			[callback, webview2](HRESULT result, ICoreWebView2Environment* env) -> HRESULT {
				Log(__FUNCTIONW__  L"\n");
				webview2->setWebView2Environment(env);
				return callback(result, env);
			}
		).Get()
	);
}

EXPORT HRESULT _CompareBrowserVersions(
	PCWSTR version1,
	PCWSTR version2,
	int* result
) {
	Log(__FUNCTIONW__  L"\n");
	return ::CompareBrowserVersions(version1, version2, result);
}

EXPORT HRESULT _GetAvailableCoreWebView2BrowserVersionString(
	PCWSTR browserExecutableFolder,
	LPWSTR* versionInfo
) {
	Log(__FUNCTIONW__  L"\n");
	return ::GetAvailableCoreWebView2BrowserVersionString(browserExecutableFolder, versionInfo);
}

/**
* Original
*/

EXPORT WebView2Connector* CreateWebView2Connector(
	ICoreWebView2Environment* env
) {
	Log(__FUNCTIONW__  L"\n");
	if (!env) {
		return new WebView2Connector();
	}
	return (new WebView2Connector())->setWebView2Environment(env);
}

EXPORT WebView2Connector* SetWebview2Environment(
	WebView2Connector* webview2,
	ICoreWebView2Environment* env
) {
	return webview2->setWebView2Environment(env);
}

EXPORT WebView2Connector* InitSettings(WebView2Connector* webview2)
{
	return webview2->initSettings();
}

EXPORT WebView2Connector* InitControllers(
	WebView2Connector* webview2,
	ICoreWebView2Controller* controller
) {
	return webview2->initControllers(controller);
}

/**
* ICoreWebView2Environment
*/

EXPORT HRESULT CreateCoreWebView2Controller(
	WebView2Connector* webview2,
	HWND hWnd,
	HRESULT(*callback)(HRESULT, ICoreWebView2Controller*)
) {
	return webview2->CreateCoreWebView2Controller(hWnd, callback);
}

/**
* ICoreWebView2Settings
*/
EXPORT HRESULT get_IsScriptEnabled(WebView2Connector* webview2, BOOL* isScriptEnabled) {
	return webview2->get_IsScriptEnabled(isScriptEnabled);
}

EXPORT HRESULT put_IsScriptEnabled(WebView2Connector* webview2, BOOL isScriptEnabled) {
	return webview2->put_IsScriptEnabled(isScriptEnabled);
}

EXPORT HRESULT get_IsWebMessageEnabled(WebView2Connector* webview2, BOOL* isWebMessageEnabled) {
	return webview2->get_IsWebMessageEnabled(isWebMessageEnabled);
}

EXPORT HRESULT put_IsWebMessageEnabled(WebView2Connector* webview2, BOOL isWebMessageEnabled) {
	return webview2->put_IsWebMessageEnabled(isWebMessageEnabled);
}

EXPORT HRESULT get_AreDefaultScriptDialogsEnabled(WebView2Connector* webview2, BOOL* areDefaultScriptDialogsEnabled) {
	return webview2->get_AreDefaultScriptDialogsEnabled(areDefaultScriptDialogsEnabled);
}

EXPORT HRESULT put_AreDefaultScriptDialogsEnabled(WebView2Connector* webview2, BOOL areDefaultScriptDialogsEnabled) {
	return webview2->put_AreDefaultScriptDialogsEnabled(areDefaultScriptDialogsEnabled);
}

EXPORT HRESULT get_IsStatusBarEnabled(WebView2Connector* webview2, BOOL* isStatusBarEnabled) {
	return webview2->get_IsStatusBarEnabled(isStatusBarEnabled);
}

EXPORT HRESULT put_IsStatusBarEnabled(WebView2Connector* webview2, BOOL isStatusBarEnabled) {
	return webview2->put_IsStatusBarEnabled(isStatusBarEnabled);
}

EXPORT HRESULT get_AreDevToolsEnabled(WebView2Connector* webview2, BOOL* areDevToolsEnabled) {
	return webview2->get_AreDevToolsEnabled(areDevToolsEnabled);
}

EXPORT HRESULT put_AreDevToolsEnabled(WebView2Connector* webview2, BOOL areDevToolsEnabled) {
	return webview2->put_AreDevToolsEnabled(areDevToolsEnabled);
}

EXPORT HRESULT get_AreDefaultContextMenusEnabled(WebView2Connector* webview2, BOOL* enabled) {
	return webview2->get_AreDefaultContextMenusEnabled(enabled);
}

EXPORT HRESULT put_AreDefaultContextMenusEnabled(WebView2Connector* webview2, BOOL enabled) {
	return webview2->put_AreDefaultContextMenusEnabled(enabled);
}

EXPORT HRESULT get_AreHostObjectsAllowed(WebView2Connector* webview2, BOOL* allowed) {
	return webview2->get_AreHostObjectsAllowed(allowed);
}

EXPORT HRESULT put_AreHostObjectsAllowed(WebView2Connector* webview2, BOOL allowed) {
	return webview2->put_AreHostObjectsAllowed(allowed);
}

EXPORT HRESULT get_IsZoomControlEnabled(WebView2Connector* webview2, BOOL* enabled) {
	return webview2->get_IsZoomControlEnabled(enabled);
}

EXPORT HRESULT put_IsZoomControlEnabled(WebView2Connector* webview2, BOOL enabled) {
	return webview2->put_IsZoomControlEnabled(enabled);
}

EXPORT HRESULT get_IsBuiltInErrorPageEnabled(WebView2Connector* webview2, BOOL* enabled) {
	return webview2->get_IsBuiltInErrorPageEnabled(enabled);
}

EXPORT HRESULT put_IsBuiltInErrorPageEnabled(WebView2Connector* webview2, BOOL enabled) {
	return webview2->put_IsBuiltInErrorPageEnabled(enabled);
}

/**
* ICoreWebView2Settings2
*/
EXPORT HRESULT get_UserAgent(WebView2Connector* webview2, LPWSTR* userAgent) {
	return webview2->get_UserAgent(userAgent);
}

EXPORT HRESULT put_UserAgent(WebView2Connector* webview2, LPCWSTR userAgent) {
	return webview2->put_UserAgent(userAgent);
}

/**
* ICoreWebView2Settings3
*/
EXPORT HRESULT get_AreBrowserAcceleratorKeysEnabled(WebView2Connector* webview2, BOOL* areBrowserAcceleratorKeysEnabled) {
	return webview2->get_AreBrowserAcceleratorKeysEnabled(areBrowserAcceleratorKeysEnabled);
}

EXPORT HRESULT put_AreBrowserAcceleratorKeysEnabled(WebView2Connector* webview2, BOOL areBrowserAcceleratorKeysEnabled) {
	return webview2->put_AreBrowserAcceleratorKeysEnabled(areBrowserAcceleratorKeysEnabled);
}

/**
* ICoreWebView2Settings4
*/
EXPORT HRESULT get_IsPasswordAutosaveEnabled(WebView2Connector* webview2, BOOL* value) {
	return webview2->get_IsPasswordAutosaveEnabled(value);
}

EXPORT HRESULT put_IsPasswordAutosaveEnabled(WebView2Connector* webview2, BOOL value) {
	return webview2->put_IsPasswordAutosaveEnabled(value);
}

EXPORT HRESULT get_IsGeneralAutofillEnabled(WebView2Connector* webview2, BOOL* value) {
	return webview2->get_IsGeneralAutofillEnabled(value);
}

EXPORT HRESULT put_IsGeneralAutofillEnabled(WebView2Connector* webview2, BOOL value) {
	return webview2->put_IsGeneralAutofillEnabled(value);
}

/**
* ICoreWebView2Settings5
*/
EXPORT HRESULT get_IsPinchZoomEnabled(WebView2Connector* webview2, /* [retval][out] */ BOOL* enabled) {
	return webview2->get_IsPinchZoomEnabled(enabled);
}

EXPORT HRESULT put_IsPinchZoomEnabled(WebView2Connector* webview2, /* [in] */ BOOL enabled) {
	return webview2->put_IsPinchZoomEnabled(enabled);
}

/**
* ICoreWebView2Settings6
*/
EXPORT HRESULT get_IsSwipeNavigationEnabled(WebView2Connector* webview2, /* [retval][out] */ BOOL* enabled) {
	return webview2->get_IsSwipeNavigationEnabled(enabled);
}

EXPORT HRESULT put_IsSwipeNavigationEnabled(WebView2Connector* webview2, /* [in] */ BOOL enabled) {
	return webview2->put_IsSwipeNavigationEnabled(enabled);
}

/*
* ICoreWebView2Controller
*/

EXPORT HRESULT add_AcceleratorKeyPressed(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2AcceleratorKeyPressedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_AcceleratorKeyPressed(callback, token);
}

EXPORT HRESULT remove_AcceleratorKeyPressed(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_AcceleratorKeyPressed(token);
}

EXPORT HRESULT get_Bounds(
	WebView2Connector* webview2,
	/* [retval][out] */ RECT* bounds
) {
	return webview2->get_Bounds(bounds);
}

EXPORT HRESULT put_Bounds(
	WebView2Connector* webview2,
	/* [in] */ RECT bounds
) {
	return webview2->put_Bounds(bounds);
}

EXPORT HRESULT Close(WebView2Connector* webview2) {
	return webview2->Close();
}

EXPORT HRESULT get_CoreWebView2(WebView2Connector* webview2) {
	return webview2->get_CoreWebView2();
}

EXPORT HRESULT add_GotFocus(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_GotFocus(callback, token);
}

EXPORT HRESULT remove_GotFocus(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_GotFocus(token);
}

EXPORT HRESULT get_IsVisible(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* isVisible
) {
	return webview2->get_IsVisible(isVisible);
}

EXPORT HRESULT put_IsVisible(
	WebView2Connector* webview2,
	/* [in] */ BOOL isVisible
) {
	return webview2->put_IsVisible(isVisible);
}

EXPORT HRESULT add_LostFocus(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_LostFocus(callback, token);
}

EXPORT HRESULT remove_LostFocus(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_LostFocus(token);
}

EXPORT HRESULT MoveFocus(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_MOVE_FOCUS_REASON reason
) {
	return webview2->MoveFocus(reason);
}


EXPORT HRESULT add_MoveFocusRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2MoveFocusRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_MoveFocusRequested(callback, token);
}

EXPORT HRESULT remove_MoveFocusRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_MoveFocusRequested(token);
}

EXPORT HRESULT NotifyParentWindowPositionChanged(WebView2Connector* webview2) {
	return webview2->NotifyParentWindowPositionChanged();
}

EXPORT HRESULT get_ParentWindow(
	WebView2Connector* webview2,
	/* [retval][out] */ HWND* parentWindow
) {
	return webview2->get_ParentWindow(parentWindow);
}

EXPORT HRESULT put_ParentWindow(
	WebView2Connector* webview2,
	/* [in] */ HWND parentWindow
) {
	return webview2->put_ParentWindow(parentWindow);
}

EXPORT HRESULT SetBoundsAndZoomFactor(
	WebView2Connector* webview2,
	/* [in] */ RECT bounds,
	/* [in] */ double zoomFactor
) {
	return webview2->SetBoundsAndZoomFactor(bounds, zoomFactor);
}

EXPORT HRESULT get_ZoomFactor(
	WebView2Connector* webview2,
	/* [retval][out] */ double* zoomFactor
) {
	return webview2->get_ZoomFactor(zoomFactor);
}

EXPORT HRESULT put_ZoomFactor(
	WebView2Connector* webview2,
	/* [in] */ double zoomFactor
) {
	return webview2->put_ZoomFactor(zoomFactor);
}

EXPORT HRESULT add_ZoomFactorChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_ZoomFactorChanged(callback, token);
}

EXPORT HRESULT remove_ZoomFactorChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_ZoomFactorChanged(token);
}

/*
* ICoreWebView2Controller2
*/

EXPORT HRESULT get_DefaultBackgroundColor(
	WebView2Connector* webview2,
	/* [retval][out] */ COREWEBVIEW2_COLOR* backgroundColor
) {
	return webview2->get_DefaultBackgroundColor(backgroundColor);
}

EXPORT HRESULT put_DefaultBackgroundColor(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_COLOR backgroundColor
) {
	return webview2->put_DefaultBackgroundColor(backgroundColor);
}

/*
* ICoreWebView2Controller3
*/

EXPORT HRESULT add_RasterizationScaleChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_RasterizationScaleChanged(callback, token);
}

EXPORT HRESULT remove_RasterizationScaleChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_RasterizationScaleChanged(token);
}

EXPORT HRESULT get_BoundsMode(
	WebView2Connector* webview2,
	/* [retval][out] */ COREWEBVIEW2_BOUNDS_MODE* boundsMode
) {
	return webview2->get_BoundsMode(boundsMode);
}

EXPORT HRESULT put_BoundsMode(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_BOUNDS_MODE boundsMode
) {
	return webview2->put_BoundsMode(boundsMode);
}

EXPORT HRESULT get_RasterizationScale(
	WebView2Connector* webview2,
	/* [retval][out] */ double* scale
) {
	return webview2->get_RasterizationScale(scale);
}

EXPORT HRESULT put_RasterizationScale(
	WebView2Connector* webview2,
	/* [in] */ double scale
) {
	return webview2->put_RasterizationScale(scale);
}

EXPORT HRESULT get_ShouldDetectMonitorScaleChanges(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* value
) {
	return webview2->get_ShouldDetectMonitorScaleChanges(value);
}

EXPORT HRESULT put_ShouldDetectMonitorScaleChanges(
	WebView2Connector* webview2,
	/* [in] */ BOOL value
) {
	return webview2->put_ShouldDetectMonitorScaleChanges(value);
}

/*
* ICoreWebView2Controller4
*/

EXPORT HRESULT get_AllowExternalDrop(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* value
) {
	return webview2->get_AllowExternalDrop(value);
}

EXPORT HRESULT put_AllowExternalDrop(
	WebView2Connector* webview2,
	/* [in] */ BOOL value
) {
	return webview2->put_AllowExternalDrop(value);
}

/**
* ICoreWebView2
*/

/* Development */

EXPORT HRESULT CallDevToolsProtocolMethod(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR methodName,
	/* [in] */ LPCWSTR parametersAsJson,
	/* [in] */ HRESULT(*callback)(/* [in] */ HRESULT, /* [in] */ LPCWSTR)
) {
	return webview2->CallDevToolsProtocolMethod(methodName, parametersAsJson, callback);
}

EXPORT HRESULT GetDevToolsProtocolEventReceiver(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR eventName,
	/* [retval][out] */ ICoreWebView2DevToolsProtocolEventReceiver** receiver
) {
	return webview2->GetDevToolsProtocolEventReceiver(eventName, receiver);
}

EXPORT HRESULT OpenDevToolsWindow(WebView2Connector* webview2) {
	return webview2->OpenDevToolsWindow();
}

/* Document */

EXPORT HRESULT add_DocumentTitleChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(/* [in] */ ICoreWebView2*, /* [in] */ IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_DocumentTitleChanged(callback, token);
}

EXPORT HRESULT remove_DocumentTitleChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_DocumentTitleChanged(token);
}

EXPORT HRESULT get_DocumentTitle(
	WebView2Connector* webview2,
	/* [retval][out] */ LPWSTR* title
) {
	return webview2->get_DocumentTitle(title);
}

/* History */

EXPORT HRESULT add_HistoryChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_HistoryChanged(callback, token);
}

EXPORT HRESULT remove_HistoryChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_HistoryChanged(token);
}

/* Message */

EXPORT HRESULT PostWebMessageAsJson(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR webMessageAsJson
) {
	return webview2->PostWebMessageAsJson(webMessageAsJson);
}

EXPORT HRESULT PostWebMessageAsString(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR webMessageAsString
) {
	return webview2->PostWebMessageAsString(webMessageAsString);
}

EXPORT HRESULT add_WebMessageReceived(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebMessageReceivedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_WebMessageReceived(callback, token);
}

EXPORT HRESULT remove_WebMessageReceived(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_WebMessageReceived(token);
}

/* Navigation */

EXPORT HRESULT Navigate(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR uri
) {
	return webview2->Navigate(uri);
}

EXPORT HRESULT add_NavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_NavigationCompleted(callback, token);
}

EXPORT HRESULT remove_NavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_NavigationCompleted(token);
}

EXPORT HRESULT add_NavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_NavigationStarting(callback, token);
}

EXPORT HRESULT remove_NavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_NavigationStarting(token);
}

EXPORT HRESULT NavigateToString(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR htmlContent
) {
	return webview2->NavigateToString(htmlContent);
}

EXPORT HRESULT add_FrameNavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_FrameNavigationCompleted(callback, token);
}

EXPORT HRESULT remove_FrameNavigationCompleted(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_FrameNavigationCompleted(token);
}

EXPORT HRESULT add_FrameNavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_FrameNavigationStarting(callback, token);
}

EXPORT HRESULT remove_FrameNavigationStarting(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_FrameNavigationStarting(token);
}

/* Permission */

EXPORT HRESULT add_PermissionRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2PermissionRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_PermissionRequested(callback, token);
}

EXPORT HRESULT remove_PermissionRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_PermissionRequested(token);
}

/* Script */

EXPORT HRESULT add_ScriptDialogOpening(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ScriptDialogOpeningEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_ScriptDialogOpening(callback, token);
}

EXPORT HRESULT remove_ScriptDialogOpening(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_ScriptDialogOpening(token);
}

EXPORT HRESULT AddScriptToExecuteOnDocumentCreated(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR javaScript,
	/* [in] */ HRESULT(*callback)(HRESULT, LPCWSTR)
) {
	return webview2->AddScriptToExecuteOnDocumentCreated(javaScript, callback);
}

EXPORT HRESULT RemoveScriptToExecuteOnDocumentCreated(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR id
) {
	return webview2->RemoveScriptToExecuteOnDocumentCreated(id);
}

EXPORT HRESULT ExecuteScript(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR javaScript,
	/* [in] */ HRESULT(*callback)(HRESULT, LPCWSTR)
) {
	return webview2->ExecuteScript(javaScript, callback);
}

EXPORT HRESULT AddHostObjectToScript(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR name,
	/* [in] */ VARIANT* object
) {
	return webview2->AddHostObjectToScript(name, object);
}

EXPORT HRESULT RemoveHostObjectFromScript(
	WebView2Connector* webview2,
	/* [in] */ LPCWSTR name
) {
	return webview2->RemoveHostObjectFromScript(name);
}

/* Source */

EXPORT HRESULT get_Source(
	WebView2Connector* webview2,
	/* [retval][out] */ LPWSTR* uri
) {
	return webview2->get_Source(uri);
}

EXPORT HRESULT add_SourceChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2SourceChangedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_SourceChanged(callback, token);
}

EXPORT HRESULT remove_SourceChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_SourceChanged(token);
}

/* Operation */

EXPORT HRESULT Reload(WebView2Connector* webview2) {
	return webview2->Reload();
}

EXPORT HRESULT get_CanGoBack(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* canGoBack
) {
	return webview2->get_CanGoBack(canGoBack);
}

EXPORT HRESULT get_CanGoForward(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* canGoForward
) {
	return webview2->get_CanGoForward(canGoForward);
}

EXPORT HRESULT GoBack(WebView2Connector* webview2) {
	return webview2->GoBack();
}

EXPORT HRESULT GoForward(WebView2Connector* webview2) {
	return webview2->GoForward();
}

EXPORT HRESULT Stop(WebView2Connector* webview2) {
	return webview2->Stop();
}

/* Other */

EXPORT HRESULT add_ContentLoading(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ContentLoadingEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_ContentLoading(callback, token);
}

EXPORT HRESULT remove_ContentLoading(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_ContentLoading(token);
}

EXPORT HRESULT add_ProcessFailed(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ProcessFailedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_ProcessFailed(callback, token);
}

EXPORT HRESULT remove_ProcessFailed(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_ProcessFailed(token);
}

EXPORT HRESULT get_Settings(WebView2Connector* webview2) {
	return webview2->get_Settings();
}

EXPORT HRESULT CapturePreview(
	WebView2Connector* webview2,
	/* [in] */ COREWEBVIEW2_CAPTURE_PREVIEW_IMAGE_FORMAT imageFormat,
	/* [in] */ IStream* imageStream,
	/* [in] */ HRESULT(*callback)(HRESULT errorCode)
) {
	// TODO: imageStream
	return webview2->CapturePreview(imageFormat, imageStream, callback);
}

EXPORT HRESULT get_BrowserProcessId(
	WebView2Connector* webview2,
	/* [retval][out] */ UINT32* value
) {
	return webview2->get_BrowserProcessId(value);
}

EXPORT HRESULT add_NewWindowRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NewWindowRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_NewWindowRequested(callback, token);
}

EXPORT HRESULT remove_NewWindowRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_NewWindowRequested(token);
}

EXPORT HRESULT add_ContainsFullScreenElementChanged(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_ContainsFullScreenElementChanged(callback, token);
}

EXPORT HRESULT remove_ContainsFullScreenElementChanged(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_ContainsFullScreenElementChanged(token);
}

EXPORT HRESULT get_ContainsFullScreenElement(
	WebView2Connector* webview2,
	/* [retval][out] */ BOOL* containsFullScreenElement
) {
	return webview2->get_ContainsFullScreenElement(containsFullScreenElement);
}

EXPORT HRESULT add_WebResourceRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebResourceRequestedEventArgs*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_WebResourceRequested(callback, token);
}

EXPORT HRESULT remove_WebResourceRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_WebResourceRequested(token);
}

EXPORT HRESULT AddWebResourceRequestedFilter(
	WebView2Connector* webview2,
	/* [in] */ const LPCWSTR uri,
	/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
) {
	return webview2->AddWebResourceRequestedFilter(uri, resourceContext);
}

EXPORT HRESULT RemoveWebResourceRequestedFilter(
	WebView2Connector* webview2,
	/* [in] */ const LPCWSTR uri,
	/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
) {
	return webview2->RemoveWebResourceRequestedFilter(uri, resourceContext);
}

EXPORT HRESULT add_WindowCloseRequested(
	WebView2Connector* webview2,
	/* [in] */ HRESULT(*callback)(ICoreWebView2*, IUnknown*),
	/* [out] */ EventRegistrationToken* token
) {
	return webview2->add_WindowCloseRequested(callback, token);
}

EXPORT HRESULT remove_WindowCloseRequested(
	WebView2Connector* webview2,
	/* [in] */ EventRegistrationToken token
) {
	return webview2->remove_WindowCloseRequested(token);
}
