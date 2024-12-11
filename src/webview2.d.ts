type WEBVIEW2_FUNCS = {
  readonly _CompareBrowserVersions: {
    readonly parameters: ['pointer', 'pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly _CreateCoreWebView2Environment: {
    readonly parameters: ['function'];
    readonly result: 'pointer';
  };
  readonly _CreateCoreWebView2EnvironmentWithOptions: {
    readonly parameters: ['pointer', 'pointer', 'pointer', 'function'];
    readonly result: 'pointer';
  };
  readonly _GetAvailableCoreWebView2BrowserVersionString: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly CreateWebView2Connector: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly initSettings: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly InitControllers: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly CreateCoreWebView2Controller: {
    readonly parameters: ['pointer', 'pointer', 'function'];
    readonly result: 'pointer';
  };
  readonly get_IsScriptEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsScriptEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsWebMessageEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsWebMessageEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_AreDefaultScriptDialogsEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_AreDefaultScriptDialogsEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsStatusBarEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsStatusBarEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_AreDevToolsEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_AreDevToolsEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_AreDefaultContextMenusEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_AreDefaultContextMenusEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_AreHostObjectsAllowed: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_AreHostObjectsAllowed: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsZoomControlEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsZoomControlEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsBuiltInErrorPageEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsBuiltInErrorPageEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_UserAgent: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_UserAgent: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly get_AreBrowserAcceleratorKeysEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_AreBrowserAcceleratorKeysEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsPasswordAutosaveEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsPasswordAutosaveEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsGeneralAutofillEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsGeneralAutofillEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsPinchZoomEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsPinchZoomEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_IsSwipeNavigationEnabled: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsSwipeNavigationEnabled: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly add_AcceleratorKeyPressed: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_AcceleratorKeyPressed: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly get_Bounds: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_Bounds: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly Close: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly get_CoreWebView2: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly add_GotFocus: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_GotFocus: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly get_IsVisible: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_IsVisible: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly add_LostFocus: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_LostFocus: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly MoveFocus: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly add_MoveFocusRequested: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_MoveFocusRequested: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly NotifyParentWindowPositionChanged: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly get_ParentWindow: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_ParentWindow: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly SetBoundsAndZoomFactor: {
    readonly parameters: ['pointer', 'buffer', 'f64'];
    readonly result: 'pointer';
  };
  readonly get_ZoomFactor: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_ZoomFactor: {
    readonly parameters: ['pointer', 'f64'];
    readonly result: 'pointer';
  };
  readonly add_ZoomFactorChanged: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_ZoomFactorChanged: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly get_DefaultBackgroundColor: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_DefaultBackgroundColor: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly add_RasterizationScaleChanged: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_RasterizationScaleChanged: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly get_BoundsMode: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_BoundsMode: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_RasterizationScale: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_RasterizationScale: {
    readonly parameters: ['pointer', 'f64'];
    readonly result: 'pointer';
  };
  readonly get_ShouldDetectMonitorScaleChanges: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_ShouldDetectMonitorScaleChanges: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly get_AllowExternalDrop: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly put_AllowExternalDrop: {
    readonly parameters: ['pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly CallDevToolsProtocolMethod: {
    readonly parameters: ['pointer', 'pointer', 'pointer', 'function'];
    readonly result: 'pointer';
  };
  readonly GetDevToolsProtocolEventReceiver: {
    readonly parameters: ['pointer', 'pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly OpenDevToolsWindow: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly add_DocumentTitleChanged: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_DocumentTitleChanged: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly get_DocumentTitle: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly add_HistoryChanged: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_HistoryChanged: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly PostWebMessageAsJson: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly PostWebMessageAsString: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly add_WebMessageReceived: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_WebMessageReceived: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly Navigate: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly add_NavigationCompleted: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_NavigationCompleted: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly add_NavigationStarting: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_NavigationStarting: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly NavigateToString: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly add_FrameNavigationCompleted: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_FrameNavigationCompleted: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly add_FrameNavigationStarting: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_FrameNavigationStarting: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly add_PermissionRequested: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_PermissionRequested: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly add_ScriptDialogOpening: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_ScriptDialogOpening: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly AddScriptToExecuteOnDocumentCreated: {
    readonly parameters: ['pointer', 'pointer', 'function'];
    readonly result: 'pointer';
  };
  readonly RemoveScriptToExecuteOnDocumentCreated: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly ExecuteScript: {
    readonly parameters: ['pointer', 'pointer', 'function'];
    readonly result: 'pointer';
  };
  readonly AddHostObjectToScript: {
    readonly parameters: ['pointer', 'pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly RemoveHostObjectFromScript: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly get_Source: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly add_SourceChanged: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_SourceChanged: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly Reload: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly get_CanGoBack: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly get_CanGoForward: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly GoBack: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly GoForward: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly Stop: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly add_ContentLoading: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_ContentLoading: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly add_ProcessFailed: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_ProcessFailed: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly get_Settings: {
    readonly parameters: ['pointer'];
    readonly result: 'pointer';
  };
  readonly CapturePreview: {
    readonly parameters: ['pointer', 'i32', 'pointer', 'function'];
    readonly result: 'pointer';
  };
  readonly get_BrowserProcessId: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly add_NewWindowRequested: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_NewWindowRequested: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly add_ContainsFullScreenElementChanged: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_ContainsFullScreenElementChanged: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly get_ContainsFullScreenElement: {
    readonly parameters: ['pointer', 'pointer'];
    readonly result: 'pointer';
  };
  readonly add_WebResourceRequested: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_WebResourceRequested: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
  readonly AddWebResourceRequestedFilter: {
    readonly parameters: ['pointer', 'pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly RemoveWebResourceRequestedFilter: {
    readonly parameters: ['pointer', 'pointer', 'i32'];
    readonly result: 'pointer';
  };
  readonly add_WindowCloseRequested: {
    readonly parameters: ['pointer', 'function', 'pointer'];
    readonly result: 'pointer';
  };
  readonly remove_WindowCloseRequested: {
    readonly parameters: ['pointer', 'buffer'];
    readonly result: 'pointer';
  };
};
