#pragma once
#include <WebView2.h>
#include <windows.h>

class WebView2Connector {
public:
	virtual WebView2Connector* setWebView2Environment(ICoreWebView2Environment* env) = 0;

	virtual WebView2Connector* initSettings() = 0;

	virtual WebView2Connector* initControllers(ICoreWebView2Controller* controller) = 0;

	/**
	* ICoreWebView2Environment
	*/

	virtual HRESULT CreateCoreWebView2Controller(HWND hWnd, HRESULT(*callback)(HRESULT, ICoreWebView2Controller*)) = 0;

	/**
	* ICoreWebView2Settings
	*/
	virtual HRESULT get_IsScriptEnabled(/* [retval][out] */ BOOL* isScriptEnabled) = 0;

	virtual HRESULT put_IsScriptEnabled(/* [in] */ BOOL isScriptEnabled) = 0;

	virtual HRESULT get_IsWebMessageEnabled(/* [retval][out] */ BOOL* isWebMessageEnabled) = 0;

	virtual HRESULT put_IsWebMessageEnabled(/* [in] */ BOOL isWebMessageEnabled) = 0;

	virtual HRESULT get_AreDefaultScriptDialogsEnabled(/* [retval][out] */ BOOL* areDefaultScriptDialogsEnabled) = 0;

	virtual HRESULT put_AreDefaultScriptDialogsEnabled(/* [in] */ BOOL areDefaultScriptDialogsEnabled) = 0;

	virtual HRESULT get_IsStatusBarEnabled(/* [retval][out] */ BOOL* isStatusBarEnabled) = 0;

	virtual HRESULT put_IsStatusBarEnabled(/* [in] */ BOOL isStatusBarEnabled) = 0;

	virtual HRESULT get_AreDevToolsEnabled(/* [retval][out] */ BOOL* areDevToolsEnabled) = 0;

	virtual HRESULT put_AreDevToolsEnabled(/* [in] */ BOOL areDevToolsEnabled) = 0;

	virtual HRESULT get_AreDefaultContextMenusEnabled(/* [retval][out] */ BOOL* enabled) = 0;

	virtual HRESULT put_AreDefaultContextMenusEnabled(BOOL enabled) = 0;

	virtual HRESULT get_AreHostObjectsAllowed(/* [retval][out] */ BOOL* allowed) = 0;

	virtual HRESULT put_AreHostObjectsAllowed(/* [in] */ BOOL allowed) = 0;

	virtual HRESULT get_IsZoomControlEnabled(/* [retval][out] */ BOOL* enabled) = 0;

	virtual HRESULT put_IsZoomControlEnabled(/* [in] */ BOOL enabled) = 0;

	virtual HRESULT get_IsBuiltInErrorPageEnabled(/* [retval][out] */ BOOL* enabled) = 0;

	virtual HRESULT put_IsBuiltInErrorPageEnabled(/* [in] */ BOOL enabled) = 0;

	/**
	* ICoreWebView2Settings2
	*/
	virtual HRESULT get_UserAgent(/* [retval][out] */ LPWSTR* userAgent) = 0;

	virtual HRESULT put_UserAgent(/* [in] */ LPCWSTR userAgent) = 0;

	/**
	* ICoreWebView2Settings3
	*/
	virtual HRESULT get_AreBrowserAcceleratorKeysEnabled(/* [retval][out] */ BOOL* areBrowserAcceleratorKeysEnabled) = 0;

	virtual HRESULT put_AreBrowserAcceleratorKeysEnabled(/* [in] */ BOOL areBrowserAcceleratorKeysEnabled) = 0;

	/**
	* ICoreWebView2Settings4
	*/
	virtual HRESULT get_IsPasswordAutosaveEnabled(/* [retval][out] */ BOOL* value) = 0;

	virtual HRESULT put_IsPasswordAutosaveEnabled(/* [in] */ BOOL value) = 0;

	virtual HRESULT get_IsGeneralAutofillEnabled(/* [retval][out] */ BOOL* value) = 0;

	virtual HRESULT put_IsGeneralAutofillEnabled(/* [in] */ BOOL value) = 0;

	/**
	* ICoreWebView2Settings5
	*/
	virtual HRESULT get_IsPinchZoomEnabled(/* [retval][out] */ BOOL* enabled) = 0;

	virtual HRESULT put_IsPinchZoomEnabled(/* [in] */ BOOL enabled) = 0;

	/**
	* ICoreWebView2Settings6
	*/
	virtual HRESULT get_IsSwipeNavigationEnabled(/* [retval][out] */ BOOL* enabled) = 0;

	virtual HRESULT put_IsSwipeNavigationEnabled(/* [in] */ BOOL enabled) = 0;

	/*
	* ICoreWebView2Controller
	*/

	virtual HRESULT add_AcceleratorKeyPressed(
		HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2AcceleratorKeyPressedEventArgs*), // ICoreWebView2AcceleratorKeyPressedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_AcceleratorKeyPressed(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT get_Bounds(
		/* [retval][out] */ RECT* bounds
	) = 0;

	virtual HRESULT put_Bounds(
		/* [in] */ RECT bounds
	) = 0;

	virtual HRESULT Close(void) = 0;

	virtual HRESULT get_CoreWebView2(
		//* [retval][out] */ ICoreWebView2** coreWebView2
	) = 0;

	virtual HRESULT add_GotFocus(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2FocusChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_GotFocus(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT get_IsVisible(
		/* [retval][out] */ BOOL* isVisible
	) = 0;

	virtual HRESULT put_IsVisible(
		/* [in] */ BOOL isVisible
	) = 0;

	virtual HRESULT add_LostFocus(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2FocusChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_LostFocus(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT MoveFocus(
		/* [in] */ COREWEBVIEW2_MOVE_FOCUS_REASON reason
	) = 0;

	virtual HRESULT add_MoveFocusRequested(
		HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2MoveFocusRequestedEventArgs*), // ICoreWebView2MoveFocusRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_MoveFocusRequested(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT NotifyParentWindowPositionChanged(void) = 0;

	virtual HRESULT get_ParentWindow(
		/* [retval][out] */ HWND* parentWindow
	) = 0;

	virtual HRESULT put_ParentWindow(
		/* [in] */ HWND parentWindow
	) = 0;

	virtual HRESULT SetBoundsAndZoomFactor(
		/* [in] */ RECT bounds,
		/* [in] */ double zoomFactor
	) = 0;

	virtual HRESULT get_ZoomFactor(
		/* [retval][out] */ double* zoomFactor
	) = 0;

	virtual HRESULT put_ZoomFactor(
		/* [in] */ double zoomFactor
	) = 0;

	virtual HRESULT add_ZoomFactorChanged(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2ZoomFactorChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_ZoomFactorChanged(
		/* [in] */ EventRegistrationToken token
	) = 0;

	/*
	* ICoreWebView2Controller2
	*/

	virtual HRESULT get_DefaultBackgroundColor(
		/* [retval][out] */ COREWEBVIEW2_COLOR* backgroundColor
	) = 0;

	virtual HRESULT put_DefaultBackgroundColor(
		/* [in] */ COREWEBVIEW2_COLOR backgroundColor
	) = 0;

	/*
	* ICoreWebView2Controller3
	*/

	virtual HRESULT add_RasterizationScaleChanged(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2RasterizationScaleChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_RasterizationScaleChanged(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT get_BoundsMode(
		/* [retval][out] */ COREWEBVIEW2_BOUNDS_MODE* boundsMode
	) = 0;

	virtual HRESULT put_BoundsMode(
		/* [in] */ COREWEBVIEW2_BOUNDS_MODE boundsMode
	) = 0;

	virtual HRESULT get_RasterizationScale(
		/* [retval][out] */ double* scale
	) = 0;

	virtual HRESULT put_RasterizationScale(
		/* [in] */ double scale
	) = 0;

	virtual HRESULT get_ShouldDetectMonitorScaleChanges(
		/* [retval][out] */ BOOL* value
	) = 0;

	virtual HRESULT put_ShouldDetectMonitorScaleChanges(
		/* [in] */ BOOL value
	) = 0;

	/*
	* ICoreWebView2Controller4
	*/

	virtual HRESULT get_AllowExternalDrop(
		/* [retval][out] */ BOOL* value
	) = 0;

	virtual HRESULT  put_AllowExternalDrop(
		/* [in] */ BOOL value
	) = 0;

	/**
	* ICoreWebView2
	*/

	/* Development */

	virtual HRESULT CallDevToolsProtocolMethod(
		/* [in] */ LPCWSTR methodName,
		/* [in] */ LPCWSTR parametersAsJson,
		HRESULT(*callback)(/* [in] */ HRESULT, /* [in] */ LPCWSTR)// ICoreWebView2CallDevToolsProtocolMethodCompletedHandler* handler
	) = 0;

	virtual HRESULT GetDevToolsProtocolEventReceiver(
		/* [in] */ LPCWSTR eventName,
		/* [retval][out] */ ICoreWebView2DevToolsProtocolEventReceiver** receiver
	) = 0;

	virtual HRESULT OpenDevToolsWindow(void) = 0;

	/* Document */

	virtual HRESULT add_DocumentTitleChanged(
		HRESULT(*callback)(/* [in] */ ICoreWebView2*, /* [in] */ IUnknown*), // ICoreWebView2DocumentTitleChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_DocumentTitleChanged(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT get_DocumentTitle(
		/* [retval][out] */ LPWSTR* title
	) = 0;

	/* History */

	virtual HRESULT add_HistoryChanged(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*), //ICoreWebView2HistoryChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_HistoryChanged(
		/* [in] */ EventRegistrationToken token
	) = 0;

	/* Message */

	virtual HRESULT PostWebMessageAsJson(
		/* [in] */ LPCWSTR webMessageAsJson
	) = 0;

	virtual HRESULT PostWebMessageAsString(
		/* [in] */ LPCWSTR webMessageAsString
	) = 0;

	virtual HRESULT add_WebMessageReceived(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebMessageReceivedEventArgs*), // ICoreWebView2WebMessageReceivedEventHandler* handler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_WebMessageReceived(
		/* [in] */ EventRegistrationToken token
	) = 0;

	/* Navigation */

	virtual HRESULT Navigate(
		/* [in] */ LPCWSTR uri
	) = 0;

	virtual HRESULT add_NavigationCompleted(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*), // ICoreWebView2NavigationCompletedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_NavigationCompleted(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT add_NavigationStarting(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*), // ICoreWebView2NavigationStartingEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_NavigationStarting(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT NavigateToString(
		/* [in] */ LPCWSTR htmlContent
	) = 0;

	virtual HRESULT add_FrameNavigationCompleted(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*), //ICoreWebView2NavigationCompletedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_FrameNavigationCompleted(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT add_FrameNavigationStarting(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*), // ICoreWebView2NavigationStartingEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_FrameNavigationStarting(
		/* [in] */ EventRegistrationToken token
	) = 0;

	/* Permission */

	virtual HRESULT add_PermissionRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2PermissionRequestedEventArgs*), // ICoreWebView2PermissionRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_PermissionRequested(
		/* [in] */ EventRegistrationToken token
	) = 0;

	/* Script */

	virtual HRESULT add_ScriptDialogOpening(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ScriptDialogOpeningEventArgs*), // ICoreWebView2ScriptDialogOpeningEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_ScriptDialogOpening(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT AddScriptToExecuteOnDocumentCreated(
		/* [in] */ LPCWSTR javaScript,
		HRESULT(*callback)(HRESULT, LPCWSTR) // ICoreWebView2AddScriptToExecuteOnDocumentCreatedCompletedHandler* handler
	) = 0;

	virtual HRESULT RemoveScriptToExecuteOnDocumentCreated(
		/* [in] */ LPCWSTR id
	) = 0;

	virtual HRESULT ExecuteScript(
		/* [in] */ LPCWSTR javaScript,
		HRESULT(*callback)(HRESULT, LPCWSTR) // ICoreWebView2ExecuteScriptCompletedHandler* handler
	) = 0;

	virtual HRESULT AddHostObjectToScript(
		/* [in] */ LPCWSTR name,
		/* [in] */ VARIANT* object
	) = 0;

	virtual HRESULT RemoveHostObjectFromScript(
		/* [in] */ LPCWSTR name
	) = 0;

	/* Source */

	virtual HRESULT get_Source(
		/* [retval][out] */ LPWSTR* uri
	) = 0;

	virtual HRESULT add_SourceChanged(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2SourceChangedEventArgs*), // ICoreWebView2SourceChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_SourceChanged(
		/* [in] */ EventRegistrationToken token
	) = 0;

	/* Operation */

	virtual HRESULT Reload(void) = 0;

	virtual HRESULT get_CanGoBack(
		/* [retval][out] */ BOOL* canGoBack
	) = 0;

	virtual HRESULT get_CanGoForward(
		/* [retval][out] */ BOOL* canGoForward
	) = 0;

	virtual HRESULT GoBack(void) = 0;

	virtual HRESULT GoForward(void) = 0;

	virtual HRESULT Stop(void) = 0;

	/* Other */

	virtual HRESULT add_ContentLoading(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ContentLoadingEventArgs*), // ICoreWebView2ContentLoadingEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_ContentLoading(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT add_ProcessFailed(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ProcessFailedEventArgs*), // ICoreWebView2ProcessFailedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_ProcessFailed(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT get_Settings(
		//* [retval][out] */ ICoreWebView2Settings** settings
	) = 0;

	virtual HRESULT CapturePreview(
		/* [in] */ COREWEBVIEW2_CAPTURE_PREVIEW_IMAGE_FORMAT imageFormat,
		/* [in] */ IStream* imageStream,
		HRESULT(*callback)(HRESULT errorCode)// ICoreWebView2CapturePreviewCompletedHandler* handler
	) = 0;

	virtual HRESULT get_BrowserProcessId(
		/* [retval][out] */ UINT32* value
	) = 0;

	virtual HRESULT add_NewWindowRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NewWindowRequestedEventArgs*), // ICoreWebView2NewWindowRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_NewWindowRequested(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT add_ContainsFullScreenElementChanged(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*), // ICoreWebView2ContainsFullScreenElementChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_ContainsFullScreenElementChanged(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT get_ContainsFullScreenElement(
		/* [retval][out] */ BOOL* containsFullScreenElement
	) = 0;

	virtual HRESULT add_WebResourceRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebResourceRequestedEventArgs*), // ICoreWebView2WebResourceRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_WebResourceRequested(
		/* [in] */ EventRegistrationToken token
	) = 0;

	virtual HRESULT AddWebResourceRequestedFilter(
		/* [in] */ const LPCWSTR uri,
		/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
	) = 0;

	virtual HRESULT RemoveWebResourceRequestedFilter(
		/* [in] */ const LPCWSTR uri,
		/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
	) = 0;

	virtual HRESULT add_WindowCloseRequested(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*), // ICoreWebView2WindowCloseRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
	) = 0;

	virtual HRESULT remove_WindowCloseRequested(
		/* [in] */ EventRegistrationToken token
	) = 0;
};

#ifndef _WINDOWS
#include <wil/com.h>
#include <wrl.h>

using namespace Microsoft::WRL;

#define CHECK(p) if (!p) { return E_POINTER; }
void Log(const WCHAR * message);

class WC : public WebView2Connector {
protected:
	wil::com_ptr<ICoreWebView2> webview;
	ICoreWebView2Environment* env;
	wil::com_ptr<ICoreWebView2Settings> settings1;
	wil::com_ptr<ICoreWebView2Settings2> settings2;
	wil::com_ptr<ICoreWebView2Settings3> settings3;
	wil::com_ptr<ICoreWebView2Settings4> settings4;
	wil::com_ptr<ICoreWebView2Settings5> settings5;
	wil::com_ptr<ICoreWebView2Settings6> settings6;
	wil::com_ptr<ICoreWebView2Controller> controller1;
	wil::com_ptr<ICoreWebView2Controller2> controller2;
	wil::com_ptr<ICoreWebView2Controller3> controller3;
	wil::com_ptr<ICoreWebView2Controller4> controller4;

public:
	virtual ~WC() {
		Log(__FUNCTIONW__  L"\n");
		this->Close();
	}

	virtual WebView2Connector* setWebView2Environment(ICoreWebView2Environment* env) {
		Log(__FUNCTIONW__  L"\n");
		this->env = env;
		return this;
	}

	virtual WebView2Connector* initSettings() {
		Log(__FUNCTIONW__  L"\n");
		this->settings2 = this->settings1.try_query<ICoreWebView2Settings2>();
		this->settings3 = this->settings1.try_query<ICoreWebView2Settings3>();
		this->settings4 = this->settings1.try_query<ICoreWebView2Settings4>();
		this->settings5 = this->settings1.try_query<ICoreWebView2Settings5>();
		this->settings6 = this->settings1.try_query<ICoreWebView2Settings6>();

		return this;
	}

	virtual WebView2Connector* initControllers(ICoreWebView2Controller* controller) {
		Log(__FUNCTIONW__  L"\n");
		this->controller1 = controller;
		this->controller2 = controller1.query<ICoreWebView2Controller2>();
		this->controller3 = controller1.query<ICoreWebView2Controller3>();
		this->controller4 = controller1.query<ICoreWebView2Controller4>();

		return this;
	}

	/**
	* ICoreWebView2Environment
	*/

	virtual HRESULT CreateCoreWebView2Controller(HWND hWnd, HRESULT(*callback)(HRESULT, ICoreWebView2Controller*)) {
		Log(__FUNCTIONW__  L"\n");
		return this->env->CreateCoreWebView2Controller(
			hWnd,
			Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
				[callback](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					wprintf(L"ICoreWebView2CreateCoreWebView2ControllerCompletedHandler:%x\n", result);
					return callback(result, controller);
				}
			).Get()
		);
	}

	/**
	* ICoreWebView2Settings
	*/
	virtual HRESULT get_IsScriptEnabled(BOOL* isScriptEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsScriptEnabled(isScriptEnabled);
	}

	virtual HRESULT put_IsScriptEnabled(BOOL isScriptEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsScriptEnabled(isScriptEnabled);
	}

	virtual HRESULT get_IsWebMessageEnabled(BOOL* isWebMessageEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsWebMessageEnabled(isWebMessageEnabled);
	}

	virtual HRESULT put_IsWebMessageEnabled(BOOL isWebMessageEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsWebMessageEnabled(isWebMessageEnabled);
	}

	virtual HRESULT get_AreDefaultScriptDialogsEnabled(BOOL* areDefaultScriptDialogsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreDefaultScriptDialogsEnabled(areDefaultScriptDialogsEnabled);
	}

	virtual HRESULT put_AreDefaultScriptDialogsEnabled(BOOL areDefaultScriptDialogsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreDefaultScriptDialogsEnabled(areDefaultScriptDialogsEnabled);
	}

	virtual HRESULT get_IsStatusBarEnabled(BOOL* isStatusBarEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsStatusBarEnabled(isStatusBarEnabled);
	}

	virtual HRESULT put_IsStatusBarEnabled(BOOL isStatusBarEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsStatusBarEnabled(isStatusBarEnabled);
	}

	virtual HRESULT get_AreDevToolsEnabled(BOOL* areDevToolsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreDevToolsEnabled(areDevToolsEnabled);
	}

	virtual HRESULT put_AreDevToolsEnabled(BOOL areDevToolsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreDevToolsEnabled(areDevToolsEnabled);
	}

	virtual HRESULT get_AreDefaultContextMenusEnabled(BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreDefaultContextMenusEnabled(enabled);
	}

	virtual HRESULT put_AreDefaultContextMenusEnabled(BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreDefaultContextMenusEnabled(enabled);
	}

	virtual HRESULT get_AreHostObjectsAllowed(BOOL* allowed) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreHostObjectsAllowed(allowed);
	}

	virtual HRESULT put_AreHostObjectsAllowed(BOOL allowed) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreHostObjectsAllowed(allowed);
	}

	virtual HRESULT get_IsZoomControlEnabled(BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsZoomControlEnabled(enabled);
	}

	virtual HRESULT put_IsZoomControlEnabled(BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsZoomControlEnabled(enabled);
	}

	virtual HRESULT get_IsBuiltInErrorPageEnabled(BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsBuiltInErrorPageEnabled(enabled);
	}

	virtual HRESULT put_IsBuiltInErrorPageEnabled(BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsBuiltInErrorPageEnabled(enabled);
	}

	/**
	* ICoreWebView2Settings2
	*/
	virtual HRESULT get_UserAgent(LPWSTR* userAgent) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings2->get_UserAgent(userAgent);
	}

	virtual HRESULT put_UserAgent(LPCWSTR userAgent) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings2->put_UserAgent(userAgent);
	}

	/**
	* ICoreWebView2Settings3
	*/
	virtual HRESULT get_AreBrowserAcceleratorKeysEnabled(BOOL* areBrowserAcceleratorKeysEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings3->get_AreBrowserAcceleratorKeysEnabled(areBrowserAcceleratorKeysEnabled);
	}

	virtual HRESULT put_AreBrowserAcceleratorKeysEnabled(BOOL areBrowserAcceleratorKeysEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings3->put_AreBrowserAcceleratorKeysEnabled(areBrowserAcceleratorKeysEnabled);
	}

	/**
	* ICoreWebView2Settings4
	*/
	virtual HRESULT get_IsPasswordAutosaveEnabled(BOOL* value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->get_IsPasswordAutosaveEnabled(value);
	}

	virtual HRESULT put_IsPasswordAutosaveEnabled(BOOL value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->put_IsPasswordAutosaveEnabled(value);
	}

	virtual HRESULT get_IsGeneralAutofillEnabled(BOOL* value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->get_IsGeneralAutofillEnabled(value);
	}

	virtual HRESULT put_IsGeneralAutofillEnabled(BOOL value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->put_IsGeneralAutofillEnabled(value);
	}

	/**
	* ICoreWebView2Settings5
	*/
	virtual HRESULT get_IsPinchZoomEnabled(BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings5->get_IsPinchZoomEnabled(enabled);
	}

	virtual HRESULT put_IsPinchZoomEnabled(BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings5->put_IsPinchZoomEnabled(enabled);
	}

	/**
	* ICoreWebView2Settings6
	*/
	virtual HRESULT get_IsSwipeNavigationEnabled(BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings6->get_IsSwipeNavigationEnabled(enabled);
	}

	virtual HRESULT put_IsSwipeNavigationEnabled(BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings6->put_IsSwipeNavigationEnabled(enabled);
	}

	/*
	* ICoreWebView2Controller
	*/

	virtual HRESULT add_AcceleratorKeyPressed(
		HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2AcceleratorKeyPressedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->add_AcceleratorKeyPressed(
			Callback<ICoreWebView2AcceleratorKeyPressedEventHandler>(
				[callback](ICoreWebView2Controller* sender, ICoreWebView2AcceleratorKeyPressedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_AcceleratorKeyPressed(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_AcceleratorKeyPressed(token);
	}

	virtual HRESULT get_Bounds(
		RECT* bounds
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_Bounds(bounds);
	}

	virtual HRESULT put_Bounds(
		RECT bounds
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_Bounds(bounds);
	}

	virtual HRESULT Close(void) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->Close();
	}

	virtual HRESULT get_CoreWebView2() {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_CoreWebView2(&this->webview);
	}

	virtual HRESULT add_GotFocus(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->add_GotFocus(
			Callback<ICoreWebView2FocusChangedEventHandler>(
				[callback](ICoreWebView2Controller* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_GotFocus(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_GotFocus(token);
	}

	virtual HRESULT get_IsVisible(
		BOOL* isVisible
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_IsVisible(isVisible);
	}

	virtual HRESULT put_IsVisible(
		BOOL isVisible
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_IsVisible(isVisible);
	}

	virtual HRESULT add_LostFocus(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->add_LostFocus(
			Callback<ICoreWebView2FocusChangedEventHandler>(
				[callback](ICoreWebView2Controller* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_LostFocus(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_LostFocus(token);
	}

	virtual HRESULT MoveFocus(
		COREWEBVIEW2_MOVE_FOCUS_REASON reason
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->MoveFocus(reason);
	}

	virtual HRESULT add_MoveFocusRequested(
		HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2MoveFocusRequestedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->add_MoveFocusRequested(
			Callback<ICoreWebView2MoveFocusRequestedEventHandler>(
				[callback](ICoreWebView2Controller* sender, ICoreWebView2MoveFocusRequestedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_MoveFocusRequested(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_MoveFocusRequested(token);
	}

	virtual HRESULT NotifyParentWindowPositionChanged(void) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->NotifyParentWindowPositionChanged();
	}

	virtual HRESULT get_ParentWindow(
		HWND* parentWindow
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_ParentWindow(parentWindow);
	}

	virtual HRESULT put_ParentWindow(
		HWND parentWindow
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_ParentWindow(parentWindow);
	}

	virtual HRESULT SetBoundsAndZoomFactor(
		RECT bounds,
		double zoomFactor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->SetBoundsAndZoomFactor(bounds, zoomFactor);
	}

	virtual HRESULT get_ZoomFactor(
		double* zoomFactor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_ZoomFactor(zoomFactor);
	}

	virtual HRESULT put_ZoomFactor(
		double zoomFactor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_ZoomFactor(zoomFactor);
	}

	virtual HRESULT add_ZoomFactorChanged(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->add_ZoomFactorChanged(
			Callback<ICoreWebView2ZoomFactorChangedEventHandler>(
				[callback](ICoreWebView2Controller* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_ZoomFactorChanged(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_ZoomFactorChanged(token);
	}

	/*
	* ICoreWebView2Controller2
	*/

	virtual HRESULT get_DefaultBackgroundColor(
		COREWEBVIEW2_COLOR* backgroundColor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller2);
		return this->controller2->get_DefaultBackgroundColor(backgroundColor);
	}

	virtual HRESULT put_DefaultBackgroundColor(
		COREWEBVIEW2_COLOR backgroundColor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller2);
		return this->controller2->put_DefaultBackgroundColor(backgroundColor);
	}

	/*
	* ICoreWebView2Controller3
	*/

	virtual HRESULT add_RasterizationScaleChanged(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->add_RasterizationScaleChanged(
			Callback<ICoreWebView2RasterizationScaleChangedEventHandler>(
				[callback](ICoreWebView2Controller* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_RasterizationScaleChanged(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->remove_RasterizationScaleChanged(token);
	}

	virtual HRESULT get_BoundsMode(
		COREWEBVIEW2_BOUNDS_MODE* boundsMode
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->get_BoundsMode(boundsMode);
	}

	virtual HRESULT put_BoundsMode(
		COREWEBVIEW2_BOUNDS_MODE boundsMode
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->put_BoundsMode(boundsMode);
	}

	virtual HRESULT get_RasterizationScale(
		double* scale
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->get_RasterizationScale(scale);
	}

	virtual HRESULT put_RasterizationScale(
		double scale
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->put_RasterizationScale(scale);
	}

	virtual HRESULT get_ShouldDetectMonitorScaleChanges(
		BOOL* value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->get_ShouldDetectMonitorScaleChanges(value);
	}

	virtual HRESULT put_ShouldDetectMonitorScaleChanges(
		BOOL value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->put_ShouldDetectMonitorScaleChanges(value);
	}

	/*
	* ICoreWebView2Controller4
	*/

	virtual HRESULT get_AllowExternalDrop(
		BOOL* value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller4);
		return this->controller4->get_AllowExternalDrop(value);
	}

	virtual HRESULT  put_AllowExternalDrop(
		BOOL value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller4);
		return this->controller4->put_AllowExternalDrop(value);
	}

	/**
	* ICoreWebView2
	*/

	/* Development */

	virtual HRESULT CallDevToolsProtocolMethod(
		LPCWSTR methodName,
		LPCWSTR parametersAsJson,
		HRESULT(*callback)(HRESULT, LPCWSTR)
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->CallDevToolsProtocolMethod(
			methodName,
			parametersAsJson,
			Callback<ICoreWebView2CallDevToolsProtocolMethodCompletedHandler>(
				[callback](HRESULT result, LPCWSTR returnObjectAsJson) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(result, returnObjectAsJson);
				}
			).Get()
		);
	}

	virtual HRESULT GetDevToolsProtocolEventReceiver(
		LPCWSTR eventName,
		ICoreWebView2DevToolsProtocolEventReceiver** receiver
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->GetDevToolsProtocolEventReceiver(eventName, receiver);
	}

	virtual HRESULT OpenDevToolsWindow(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->OpenDevToolsWindow();
	}

	/* Document */

	virtual HRESULT add_DocumentTitleChanged(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_DocumentTitleChanged(
			Callback<ICoreWebView2DocumentTitleChangedEventHandler>(
				[callback](ICoreWebView2* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_DocumentTitleChanged(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_DocumentTitleChanged(token);
	}

	virtual HRESULT get_DocumentTitle(
		LPWSTR* title
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_DocumentTitle(title);
	}

	/* History */

	virtual HRESULT add_HistoryChanged(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_HistoryChanged(
			Callback<ICoreWebView2HistoryChangedEventHandler>(
				[callback](ICoreWebView2* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_HistoryChanged(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_HistoryChanged(token);
	}

	/* Message */

	virtual HRESULT PostWebMessageAsJson(
		LPCWSTR webMessageAsJson
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->PostWebMessageAsJson(webMessageAsJson);
	}

	virtual HRESULT PostWebMessageAsString(
		LPCWSTR webMessageAsString
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->PostWebMessageAsString(webMessageAsString);
	}

	virtual HRESULT add_WebMessageReceived(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebMessageReceivedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_WebMessageReceived(
			Callback<ICoreWebView2WebMessageReceivedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2WebMessageReceivedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_WebMessageReceived(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_WebMessageReceived(token);
	}

	/* Navigation */

	virtual HRESULT Navigate(
		LPCWSTR uri
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->Navigate(uri);
	}

	virtual HRESULT add_NavigationCompleted(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_NavigationCompleted(
			Callback<ICoreWebView2NavigationCompletedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2NavigationCompletedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_NavigationCompleted(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_NavigationCompleted(token);
	}

	virtual HRESULT add_NavigationStarting(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_NavigationStarting(
			Callback<ICoreWebView2NavigationStartingEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2NavigationStartingEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_NavigationStarting(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_NavigationStarting(token);
	}

	virtual HRESULT NavigateToString(
		LPCWSTR htmlContent
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->NavigateToString(htmlContent);
	}

	virtual HRESULT add_FrameNavigationCompleted(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_FrameNavigationCompleted(
			Callback<ICoreWebView2NavigationCompletedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2NavigationCompletedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_FrameNavigationCompleted(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_FrameNavigationCompleted(token);
	}

	virtual HRESULT add_FrameNavigationStarting(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_FrameNavigationStarting(
			Callback<ICoreWebView2NavigationStartingEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2NavigationStartingEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_FrameNavigationStarting(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_FrameNavigationStarting(token);
	}

	/* Permission */

	virtual HRESULT add_PermissionRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2PermissionRequestedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_PermissionRequested(
			Callback<ICoreWebView2PermissionRequestedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2PermissionRequestedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_PermissionRequested(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_PermissionRequested(token);
	}

	/* Script */

	virtual HRESULT add_ScriptDialogOpening(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ScriptDialogOpeningEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_ScriptDialogOpening(
			Callback<ICoreWebView2ScriptDialogOpeningEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2ScriptDialogOpeningEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_ScriptDialogOpening(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ScriptDialogOpening(token);
	}

	virtual HRESULT AddScriptToExecuteOnDocumentCreated(
		LPCWSTR javaScript,
		HRESULT(*callback)(HRESULT, LPCWSTR)
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->AddScriptToExecuteOnDocumentCreated(
			javaScript,
			Callback<ICoreWebView2AddScriptToExecuteOnDocumentCreatedCompletedHandler>(
				[callback](HRESULT errorCode, LPCWSTR id) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(errorCode, id);
				}
			).Get()
		);
	}

	virtual HRESULT RemoveScriptToExecuteOnDocumentCreated(
		LPCWSTR id
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->RemoveScriptToExecuteOnDocumentCreated(id);
	}

	virtual HRESULT ExecuteScript(
		LPCWSTR javaScript,
		HRESULT(*callback)(HRESULT, LPCWSTR)
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->ExecuteScript(
			javaScript,
			Callback<ICoreWebView2ExecuteScriptCompletedHandler>(
				[callback](HRESULT errorCode, LPCWSTR resultObjectAsJson) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(errorCode, resultObjectAsJson);
				}
			).Get()
		);
	}

	virtual HRESULT AddHostObjectToScript(
		LPCWSTR name,
		VARIANT* object
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->AddHostObjectToScript(name, object);
	}

	virtual HRESULT RemoveHostObjectFromScript(
		LPCWSTR name
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->RemoveHostObjectFromScript(name);
	}

	/* Source */

	virtual HRESULT get_Source(
		LPWSTR* uri
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_Source(uri);
	}

	virtual HRESULT add_SourceChanged(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2SourceChangedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_SourceChanged(
			Callback<ICoreWebView2SourceChangedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2SourceChangedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_SourceChanged(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_SourceChanged(token);
	}

	/* Operation */

	virtual HRESULT Reload(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->Reload();
	}

	virtual HRESULT get_CanGoBack(
		BOOL* canGoBack
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_CanGoBack(canGoBack);
	}

	virtual HRESULT get_CanGoForward(
		BOOL* canGoForward
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_CanGoForward(canGoForward);
	}

	virtual HRESULT GoBack(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->GoBack();
	}

	virtual HRESULT GoForward(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->GoForward();
	}

	virtual HRESULT Stop(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->Stop();
	}

	/* Other */

	virtual HRESULT add_ContentLoading(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ContentLoadingEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_ContentLoading(
			Callback<ICoreWebView2ContentLoadingEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2ContentLoadingEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_ContentLoading(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ContentLoading(token);
	}

	virtual HRESULT add_ProcessFailed(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ProcessFailedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_ProcessFailed(
			Callback<ICoreWebView2ProcessFailedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2ProcessFailedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_ProcessFailed(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ProcessFailed(token);
	}

	virtual HRESULT get_Settings() {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_Settings(&(this->settings1));
	}

	virtual HRESULT CapturePreview(
		COREWEBVIEW2_CAPTURE_PREVIEW_IMAGE_FORMAT imageFormat,
		IStream* imageStream,
		HRESULT(*callback)(HRESULT errorCode)
	) {
		Log(__FUNCTIONW__  L"\n");
		// TODO: imageStream
		return this->webview->CapturePreview(
			imageFormat,
			imageStream,
			Callback<ICoreWebView2CapturePreviewCompletedHandler>(
				[callback](HRESULT errorCode) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(errorCode);
				}
			).Get()
		);
	}

	virtual HRESULT get_BrowserProcessId(
		UINT32* value
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_BrowserProcessId(value);
	}

	virtual HRESULT add_NewWindowRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NewWindowRequestedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_NewWindowRequested(
			Callback<ICoreWebView2NewWindowRequestedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2NewWindowRequestedEventArgs* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_NewWindowRequested(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_NewWindowRequested(token);
	}

	virtual HRESULT add_ContainsFullScreenElementChanged(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_ContainsFullScreenElementChanged(
			Callback<ICoreWebView2ContainsFullScreenElementChangedEventHandler>(
				[callback](ICoreWebView2* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_ContainsFullScreenElementChanged(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ContainsFullScreenElementChanged(token);
	}

	virtual HRESULT get_ContainsFullScreenElement(
		BOOL* containsFullScreenElement
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_ContainsFullScreenElement(containsFullScreenElement);
	}

	virtual HRESULT add_WebResourceRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebResourceRequestedEventArgs*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_WebResourceRequested(
			Callback<ICoreWebView2WebResourceRequestedEventHandler>(
				[callback](ICoreWebView2* sender, ICoreWebView2WebResourceRequestedEventArgs* args) -> HRESULT {
		Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_WebResourceRequested(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_WebResourceRequested(token);
	}

	virtual HRESULT AddWebResourceRequestedFilter(
		const LPCWSTR uri,
		const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->AddWebResourceRequestedFilter(uri, resourceContext);
	}

	virtual HRESULT RemoveWebResourceRequestedFilter(
		const LPCWSTR uri,
		const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->RemoveWebResourceRequestedFilter(uri, resourceContext);
	}

	virtual HRESULT add_WindowCloseRequested(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*),
		EventRegistrationToken* token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->add_WindowCloseRequested(
			Callback<ICoreWebView2WindowCloseRequestedEventHandler>(
				[callback](ICoreWebView2* sender, IUnknown* args) -> HRESULT {
					Log(__FUNCTIONW__  L"\n");
					return callback(sender, args);
				}
			).Get(),
			token
		);
	}

	virtual HRESULT remove_WindowCloseRequested(
		EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_WindowCloseRequested(token);
	}
};

#endif
