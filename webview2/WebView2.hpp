#pragma once

#include <wil/com.h>
#include <WebView2.h>
#include <wrl.h>

using namespace Microsoft::WRL;

#define CHECK(p) if (!p) { return E_POINTER; }
#define EXPORT extern "C" __declspec(dllexport)
void Log(const WCHAR * message);

class WebView2Connector {
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
	virtual ~WebView2Connector() {
		Log(__FUNCTIONW__  L"\n");
		this->Close();
	}

	WebView2Connector* setWebView2Environment(ICoreWebView2Environment* env) {
		Log(__FUNCTIONW__  L"\n");
		this->env = env;
		return this;
	}

	WebView2Connector* initSettings() {
		Log(__FUNCTIONW__  L"\n");
		this->settings2 = this->settings1.try_query<ICoreWebView2Settings2>();
		this->settings3 = this->settings1.try_query<ICoreWebView2Settings3>();
		this->settings4 = this->settings1.try_query<ICoreWebView2Settings4>();
		this->settings5 = this->settings1.try_query<ICoreWebView2Settings5>();
		this->settings6 = this->settings1.try_query<ICoreWebView2Settings6>();

		return this;
	}

	WebView2Connector* initControllers(ICoreWebView2Controller* controller) {
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

	HRESULT CreateCoreWebView2Controller(HWND hWnd, HRESULT(*callback)(HRESULT, ICoreWebView2Controller*)) {
		Log(__FUNCTIONW__  L"\n");
		return this->env->CreateCoreWebView2Controller(
			hWnd,
			Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
				[callback](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT {
					wprintf(L"ICoreWebView2CreateCoreWebView2ControllerCompletedHandler:%x\n", result);
					Log(__FUNCTIONW__  L"\n");
					return callback(result, controller);
				}
			).Get()
		);
	}

	/**
	* ICoreWebView2Settings
	*/
	HRESULT get_IsScriptEnabled(/* [retval][out] */ BOOL* isScriptEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsScriptEnabled(isScriptEnabled);
	}

	HRESULT put_IsScriptEnabled(/* [in] */ BOOL isScriptEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsScriptEnabled(isScriptEnabled);
	}

	HRESULT get_IsWebMessageEnabled(/* [retval][out] */ BOOL* isWebMessageEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsWebMessageEnabled(isWebMessageEnabled);
	}

	HRESULT put_IsWebMessageEnabled(/* [in] */ BOOL isWebMessageEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsWebMessageEnabled(isWebMessageEnabled);
	}

	HRESULT get_AreDefaultScriptDialogsEnabled(/* [retval][out] */ BOOL* areDefaultScriptDialogsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreDefaultScriptDialogsEnabled(areDefaultScriptDialogsEnabled);
	}

	HRESULT put_AreDefaultScriptDialogsEnabled(/* [in] */ BOOL areDefaultScriptDialogsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreDefaultScriptDialogsEnabled(areDefaultScriptDialogsEnabled);
	}

	HRESULT get_IsStatusBarEnabled(/* [retval][out] */ BOOL* isStatusBarEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsStatusBarEnabled(isStatusBarEnabled);
	}

	HRESULT put_IsStatusBarEnabled(/* [in] */ BOOL isStatusBarEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsStatusBarEnabled(isStatusBarEnabled);
	}

	HRESULT get_AreDevToolsEnabled(/* [retval][out] */ BOOL* areDevToolsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreDevToolsEnabled(areDevToolsEnabled);
	}

	HRESULT put_AreDevToolsEnabled(/* [in] */ BOOL areDevToolsEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreDevToolsEnabled(areDevToolsEnabled);
	}

	HRESULT get_AreDefaultContextMenusEnabled(/* [retval][out] */ BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreDefaultContextMenusEnabled(enabled);
	}

	HRESULT put_AreDefaultContextMenusEnabled(BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreDefaultContextMenusEnabled(enabled);
	}

	HRESULT get_AreHostObjectsAllowed(/* [retval][out] */ BOOL* allowed) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_AreHostObjectsAllowed(allowed);
	}

	HRESULT put_AreHostObjectsAllowed(/* [in] */ BOOL allowed) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_AreHostObjectsAllowed(allowed);
	}

	HRESULT get_IsZoomControlEnabled(/* [retval][out] */ BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsZoomControlEnabled(enabled);
	}

	HRESULT put_IsZoomControlEnabled(/* [in] */ BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsZoomControlEnabled(enabled);
	}

	HRESULT get_IsBuiltInErrorPageEnabled(/* [retval][out] */ BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->get_IsBuiltInErrorPageEnabled(enabled);
	}

	HRESULT put_IsBuiltInErrorPageEnabled(/* [in] */ BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings1->put_IsBuiltInErrorPageEnabled(enabled);
	}

	/**
	* ICoreWebView2Settings2
	*/
	HRESULT get_UserAgent(/* [retval][out] */ LPWSTR* userAgent) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings2->get_UserAgent(userAgent);
	}

	HRESULT put_UserAgent(/* [in] */ LPCWSTR userAgent) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings2->put_UserAgent(userAgent);
	}

	/**
	* ICoreWebView2Settings3
	*/
	HRESULT get_AreBrowserAcceleratorKeysEnabled(/* [retval][out] */ BOOL* areBrowserAcceleratorKeysEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings3->get_AreBrowserAcceleratorKeysEnabled(areBrowserAcceleratorKeysEnabled);
	}

	HRESULT put_AreBrowserAcceleratorKeysEnabled(/* [in] */ BOOL areBrowserAcceleratorKeysEnabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings3->put_AreBrowserAcceleratorKeysEnabled(areBrowserAcceleratorKeysEnabled);
	}

	/**
	* ICoreWebView2Settings4
	*/
	HRESULT get_IsPasswordAutosaveEnabled(/* [retval][out] */ BOOL* value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->get_IsPasswordAutosaveEnabled(value);
	}

	HRESULT put_IsPasswordAutosaveEnabled(/* [in] */ BOOL value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->put_IsPasswordAutosaveEnabled(value);
	}

	HRESULT get_IsGeneralAutofillEnabled(/* [retval][out] */ BOOL* value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->get_IsGeneralAutofillEnabled(value);
	}

	HRESULT put_IsGeneralAutofillEnabled(/* [in] */ BOOL value) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings4->put_IsGeneralAutofillEnabled(value);
	}

	/**
	* ICoreWebView2Settings5
	*/
	HRESULT get_IsPinchZoomEnabled(/* [retval][out] */ BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings5->get_IsPinchZoomEnabled(enabled);
	}

	HRESULT put_IsPinchZoomEnabled(/* [in] */ BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings5->put_IsPinchZoomEnabled(enabled);
	}

	/**
	* ICoreWebView2Settings6
	*/
	HRESULT get_IsSwipeNavigationEnabled(/* [retval][out] */ BOOL* enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings6->get_IsSwipeNavigationEnabled(enabled);
	}

	HRESULT put_IsSwipeNavigationEnabled(/* [in] */ BOOL enabled) {
		Log(__FUNCTIONW__  L"\n");
		return this->settings6->put_IsSwipeNavigationEnabled(enabled);
	}

	/*
	* ICoreWebView2Controller
	*/

	HRESULT add_AcceleratorKeyPressed(
		HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2AcceleratorKeyPressedEventArgs*), // ICoreWebView2AcceleratorKeyPressedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_AcceleratorKeyPressed(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_AcceleratorKeyPressed(token);
	}

	HRESULT get_Bounds(
		/* [retval][out] */ RECT* bounds
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_Bounds(bounds);
	}

	HRESULT put_Bounds(
		/* [in] */ RECT bounds
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_Bounds(bounds);
	}

	HRESULT Close(void) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->Close();
	}

	HRESULT get_CoreWebView2(
		//* [retval][out] */ ICoreWebView2** coreWebView2
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_CoreWebView2(&this->webview);
	}

	HRESULT add_GotFocus(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2FocusChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_GotFocus(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_GotFocus(token);
	}

	HRESULT get_IsVisible(
		/* [retval][out] */ BOOL* isVisible
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_IsVisible(isVisible);
	}

	HRESULT put_IsVisible(
		/* [in] */ BOOL isVisible
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_IsVisible(isVisible);
	}

	HRESULT add_LostFocus(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2FocusChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_LostFocus(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_LostFocus(token);
	}

	HRESULT MoveFocus(
		/* [in] */ COREWEBVIEW2_MOVE_FOCUS_REASON reason
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->MoveFocus(reason);
	}

	HRESULT add_MoveFocusRequested(
		HRESULT(*callback)(ICoreWebView2Controller*, ICoreWebView2MoveFocusRequestedEventArgs*), // ICoreWebView2MoveFocusRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_MoveFocusRequested(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_MoveFocusRequested(token);
	}

	HRESULT NotifyParentWindowPositionChanged(void) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->NotifyParentWindowPositionChanged();
	}

	HRESULT get_ParentWindow(
		/* [retval][out] */ HWND* parentWindow
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_ParentWindow(parentWindow);
	}

	HRESULT put_ParentWindow(
		/* [in] */ HWND parentWindow
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_ParentWindow(parentWindow);
	}

	HRESULT SetBoundsAndZoomFactor(
		/* [in] */ RECT bounds,
		/* [in] */ double zoomFactor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->SetBoundsAndZoomFactor(bounds, zoomFactor);
	}

	HRESULT get_ZoomFactor(
		/* [retval][out] */ double* zoomFactor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->get_ZoomFactor(zoomFactor);
	}

	HRESULT put_ZoomFactor(
		/* [in] */ double zoomFactor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->put_ZoomFactor(zoomFactor);
	}

	HRESULT add_ZoomFactorChanged(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2ZoomFactorChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_ZoomFactorChanged(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller1);
		return this->controller1->remove_ZoomFactorChanged(token);
	}

	/*
	* ICoreWebView2Controller2
	*/

	HRESULT get_DefaultBackgroundColor(
		/* [retval][out] */ COREWEBVIEW2_COLOR* backgroundColor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller2);
		return this->controller2->get_DefaultBackgroundColor(backgroundColor);
	}

	HRESULT put_DefaultBackgroundColor(
		/* [in] */ COREWEBVIEW2_COLOR backgroundColor
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller2);
		return this->controller2->put_DefaultBackgroundColor(backgroundColor);
	}

	/*
	* ICoreWebView2Controller3
	*/

	HRESULT add_RasterizationScaleChanged(
		HRESULT(*callback)(ICoreWebView2Controller*, IUnknown*), // ICoreWebView2RasterizationScaleChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_RasterizationScaleChanged(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->remove_RasterizationScaleChanged(token);
	}

	HRESULT get_BoundsMode(
		/* [retval][out] */ COREWEBVIEW2_BOUNDS_MODE* boundsMode
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->get_BoundsMode(boundsMode);
	}

	HRESULT put_BoundsMode(
		/* [in] */ COREWEBVIEW2_BOUNDS_MODE boundsMode
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->put_BoundsMode(boundsMode);
	}

	HRESULT get_RasterizationScale(
		/* [retval][out] */ double* scale
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->get_RasterizationScale(scale);
	}

	HRESULT put_RasterizationScale(
		/* [in] */ double scale
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->put_RasterizationScale(scale);
	}

	HRESULT get_ShouldDetectMonitorScaleChanges(
		/* [retval][out] */ BOOL* value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->get_ShouldDetectMonitorScaleChanges(value);
	}

	HRESULT put_ShouldDetectMonitorScaleChanges(
		/* [in] */ BOOL value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller3);
		return this->controller3->put_ShouldDetectMonitorScaleChanges(value);
	}

	/*
	* ICoreWebView2Controller4
	*/

	HRESULT get_AllowExternalDrop(
		/* [retval][out] */ BOOL* value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller4);
		return this->controller4->get_AllowExternalDrop(value);
	}

	HRESULT  put_AllowExternalDrop(
		/* [in] */ BOOL value
	) {
		Log(__FUNCTIONW__  L"\n");
		CHECK(this->controller4);
		return this->controller4->put_AllowExternalDrop(value);
	}

	/**
	* ICoreWebView2
	*/

	/* Development */

	HRESULT CallDevToolsProtocolMethod(
		/* [in] */ LPCWSTR methodName,
		/* [in] */ LPCWSTR parametersAsJson,
		HRESULT(*callback)(/* [in] */ HRESULT, /* [in] */ LPCWSTR)// ICoreWebView2CallDevToolsProtocolMethodCompletedHandler* handler
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

	HRESULT GetDevToolsProtocolEventReceiver(
		/* [in] */ LPCWSTR eventName,
		/* [retval][out] */ ICoreWebView2DevToolsProtocolEventReceiver** receiver
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->GetDevToolsProtocolEventReceiver(eventName, receiver);
	}

	HRESULT OpenDevToolsWindow(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->OpenDevToolsWindow();
	}

	/* Document */

	HRESULT add_DocumentTitleChanged(
		HRESULT(*callback)(/* [in] */ ICoreWebView2*, /* [in] */ IUnknown*), // ICoreWebView2DocumentTitleChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_DocumentTitleChanged(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_DocumentTitleChanged(token);
	}

	HRESULT get_DocumentTitle(
		/* [retval][out] */ LPWSTR* title
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_DocumentTitle(title);
	}

	/* History */

	HRESULT add_HistoryChanged(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*), //ICoreWebView2HistoryChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_HistoryChanged(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_HistoryChanged(token);
	}

	/* Message */

	HRESULT PostWebMessageAsJson(
		/* [in] */ LPCWSTR webMessageAsJson
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->PostWebMessageAsJson(webMessageAsJson);
	}

	HRESULT PostWebMessageAsString(
		/* [in] */ LPCWSTR webMessageAsString
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->PostWebMessageAsString(webMessageAsString);
	}

	HRESULT add_WebMessageReceived(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebMessageReceivedEventArgs*), // ICoreWebView2WebMessageReceivedEventHandler* handler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_WebMessageReceived(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_WebMessageReceived(token);
	}

	/* Navigation */

	HRESULT Navigate(
		/* [in] */ LPCWSTR uri
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->Navigate(uri);
	}

	HRESULT add_NavigationCompleted(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*), // ICoreWebView2NavigationCompletedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_NavigationCompleted(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_NavigationCompleted(token);
	}

	HRESULT add_NavigationStarting(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*), // ICoreWebView2NavigationStartingEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_NavigationStarting(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_NavigationStarting(token);
	}

	HRESULT NavigateToString(
		/* [in] */ LPCWSTR htmlContent
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->NavigateToString(htmlContent);
	}

	HRESULT add_FrameNavigationCompleted(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationCompletedEventArgs*), //ICoreWebView2NavigationCompletedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_FrameNavigationCompleted(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_FrameNavigationCompleted(token);
	}

	HRESULT add_FrameNavigationStarting(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NavigationStartingEventArgs*), // ICoreWebView2NavigationStartingEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_FrameNavigationStarting(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_FrameNavigationStarting(token);
	}

	/* Permission */

	HRESULT add_PermissionRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2PermissionRequestedEventArgs*), // ICoreWebView2PermissionRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_PermissionRequested(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_PermissionRequested(token);
	}

	/* Script */

	HRESULT add_ScriptDialogOpening(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ScriptDialogOpeningEventArgs*), // ICoreWebView2ScriptDialogOpeningEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_ScriptDialogOpening(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ScriptDialogOpening(token);
	}

	HRESULT AddScriptToExecuteOnDocumentCreated(
		/* [in] */ LPCWSTR javaScript,
		HRESULT(*callback)(HRESULT, LPCWSTR) // ICoreWebView2AddScriptToExecuteOnDocumentCreatedCompletedHandler* handler
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

	HRESULT RemoveScriptToExecuteOnDocumentCreated(
		/* [in] */ LPCWSTR id
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->RemoveScriptToExecuteOnDocumentCreated(id);
	}

	HRESULT ExecuteScript(
		/* [in] */ LPCWSTR javaScript,
		HRESULT(*callback)(HRESULT, LPCWSTR) // ICoreWebView2ExecuteScriptCompletedHandler* handler
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

	HRESULT AddHostObjectToScript(
		/* [in] */ LPCWSTR name,
		/* [in] */ VARIANT* object
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->AddHostObjectToScript(name, object);
	}

	HRESULT RemoveHostObjectFromScript(
		/* [in] */ LPCWSTR name
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->RemoveHostObjectFromScript(name);
	}

	/* Source */

	HRESULT get_Source(
		/* [retval][out] */ LPWSTR* uri
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_Source(uri);
	}

	HRESULT add_SourceChanged(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2SourceChangedEventArgs*), // ICoreWebView2SourceChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_SourceChanged(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_SourceChanged(token);
	}

	/* Operation */

	HRESULT Reload(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->Reload();
	}

	HRESULT get_CanGoBack(
		/* [retval][out] */ BOOL* canGoBack
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_CanGoBack(canGoBack);
	}

	HRESULT get_CanGoForward(
		/* [retval][out] */ BOOL* canGoForward
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_CanGoForward(canGoForward);
	}

	HRESULT GoBack(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->GoBack();
	}

	HRESULT GoForward(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->GoForward();
	}

	HRESULT Stop(void) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->Stop();
	}

	/* Other */

	HRESULT add_ContentLoading(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ContentLoadingEventArgs*), // ICoreWebView2ContentLoadingEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_ContentLoading(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ContentLoading(token);
	}

	HRESULT add_ProcessFailed(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2ProcessFailedEventArgs*), // ICoreWebView2ProcessFailedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_ProcessFailed(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ProcessFailed(token);
	}

	HRESULT get_Settings(
		//* [retval][out] */ ICoreWebView2Settings** settings
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_Settings(&(this->settings1));
	}

	HRESULT CapturePreview(
		/* [in] */ COREWEBVIEW2_CAPTURE_PREVIEW_IMAGE_FORMAT imageFormat,
		/* [in] */ IStream* imageStream,
		HRESULT(*callback)(HRESULT errorCode)// ICoreWebView2CapturePreviewCompletedHandler* handler
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

	HRESULT get_BrowserProcessId(
		/* [retval][out] */ UINT32* value
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_BrowserProcessId(value);
	}

	HRESULT add_NewWindowRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2NewWindowRequestedEventArgs*), // ICoreWebView2NewWindowRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_NewWindowRequested(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_NewWindowRequested(token);
	}

	HRESULT add_ContainsFullScreenElementChanged(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*), // ICoreWebView2ContainsFullScreenElementChangedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_ContainsFullScreenElementChanged(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_ContainsFullScreenElementChanged(token);
	}

	HRESULT get_ContainsFullScreenElement(
		/* [retval][out] */ BOOL* containsFullScreenElement
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->get_ContainsFullScreenElement(containsFullScreenElement);
	}

	HRESULT add_WebResourceRequested(
		HRESULT(*callback)(ICoreWebView2*, ICoreWebView2WebResourceRequestedEventArgs*), // ICoreWebView2WebResourceRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_WebResourceRequested(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_WebResourceRequested(token);
	}

	HRESULT AddWebResourceRequestedFilter(
		/* [in] */ const LPCWSTR uri,
		/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->AddWebResourceRequestedFilter(uri, resourceContext);
	}

	HRESULT RemoveWebResourceRequestedFilter(
		/* [in] */ const LPCWSTR uri,
		/* [in] */ const COREWEBVIEW2_WEB_RESOURCE_CONTEXT resourceContext
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->RemoveWebResourceRequestedFilter(uri, resourceContext);
	}

	HRESULT add_WindowCloseRequested(
		HRESULT(*callback)(ICoreWebView2*, IUnknown*), // ICoreWebView2WindowCloseRequestedEventHandler* eventHandler,
		/* [out] */ EventRegistrationToken* token
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

	HRESULT remove_WindowCloseRequested(
		/* [in] */ EventRegistrationToken token
	) {
		Log(__FUNCTIONW__  L"\n");
		return this->webview->remove_WindowCloseRequested(token);
	}
};

// Library func.
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
EXPORT WebView2Connector* SetWebview2Environment(
	WebView2Connector* webview2,
	ICoreWebView2Environment* env
);
EXPORT HRESULT CreateCoreWebView2Controller(
	WebView2Connector* webview2,
	HWND hWnd,
	HRESULT(*callback)(HRESULT, ICoreWebView2Controller*)
);
EXPORT HRESULT _CompareBrowserVersions(PCWSTR version1, PCWSTR version2, int* result);
EXPORT HRESULT _GetAvailableCoreWebView2BrowserVersionString(PCWSTR browserExecutableFolder, LPWSTR* versionInfo);
EXPORT WebView2Connector* CreateWebView2Connector(
	ICoreWebView2Environment* env
);
EXPORT WebView2Connector* SetWebview2Environment(
	WebView2Connector* webview2,
	ICoreWebView2Environment* env
);
