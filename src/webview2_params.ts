export const params: WEBVIEW2_FUNCS = {
  _CompareBrowserVersions: {
    parameters: ['pointer', 'pointer', 'pointer'],
    result: 'pointer',
  },
  _CreateCoreWebView2Environment: {
    parameters: ['function'],
    result: 'pointer',
  },
  _CreateCoreWebView2EnvironmentWithOptions: {
    parameters: ['pointer', 'pointer', 'pointer', 'function'],
    result: 'pointer',
  },
  _GetAvailableCoreWebView2BrowserVersionString: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  CreateWebView2Connector: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  initSettings: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  InitControllers: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  CreateCoreWebView2Controller: {
    parameters: ['pointer', 'pointer', 'function'],
    result: 'pointer',
  },
  get_IsScriptEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsScriptEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsWebMessageEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsWebMessageEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_AreDefaultScriptDialogsEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_AreDefaultScriptDialogsEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsStatusBarEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsStatusBarEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_AreDevToolsEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_AreDevToolsEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_AreDefaultContextMenusEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_AreDefaultContextMenusEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_AreHostObjectsAllowed: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_AreHostObjectsAllowed: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsZoomControlEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsZoomControlEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsBuiltInErrorPageEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsBuiltInErrorPageEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_UserAgent: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_UserAgent: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  get_AreBrowserAcceleratorKeysEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_AreBrowserAcceleratorKeysEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsPasswordAutosaveEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsPasswordAutosaveEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsGeneralAutofillEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsGeneralAutofillEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsPinchZoomEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsPinchZoomEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_IsSwipeNavigationEnabled: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsSwipeNavigationEnabled: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  add_AcceleratorKeyPressed: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_AcceleratorKeyPressed: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  get_Bounds: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_Bounds: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  Close: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  get_CoreWebView2: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  add_GotFocus: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_GotFocus: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  get_IsVisible: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_IsVisible: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  add_LostFocus: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_LostFocus: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  MoveFocus: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  add_MoveFocusRequested: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_MoveFocusRequested: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  NotifyParentWindowPositionChanged: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  get_ParentWindow: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_ParentWindow: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  SetBoundsAndZoomFactor: {
    parameters: ['pointer', 'buffer', 'f64'],
    result: 'pointer',
  },
  get_ZoomFactor: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_ZoomFactor: {
    parameters: ['pointer', 'f64'],
    result: 'pointer',
  },
  add_ZoomFactorChanged: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_ZoomFactorChanged: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  get_DefaultBackgroundColor: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_DefaultBackgroundColor: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  add_RasterizationScaleChanged: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_RasterizationScaleChanged: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  get_BoundsMode: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_BoundsMode: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_RasterizationScale: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_RasterizationScale: {
    parameters: ['pointer', 'f64'],
    result: 'pointer',
  },
  get_ShouldDetectMonitorScaleChanges: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_ShouldDetectMonitorScaleChanges: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  get_AllowExternalDrop: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  put_AllowExternalDrop: {
    parameters: ['pointer', 'i32'],
    result: 'pointer',
  },
  CallDevToolsProtocolMethod: {
    parameters: ['pointer', 'pointer', 'pointer', 'function'],
    result: 'pointer',
  },
  GetDevToolsProtocolEventReceiver: {
    parameters: ['pointer', 'pointer', 'pointer'],
    result: 'pointer',
  },
  OpenDevToolsWindow: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  add_DocumentTitleChanged: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_DocumentTitleChanged: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  get_DocumentTitle: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  add_HistoryChanged: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_HistoryChanged: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  PostWebMessageAsJson: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  PostWebMessageAsString: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  add_WebMessageReceived: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_WebMessageReceived: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  Navigate: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  add_NavigationCompleted: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_NavigationCompleted: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  add_NavigationStarting: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_NavigationStarting: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  NavigateToString: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  add_FrameNavigationCompleted: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_FrameNavigationCompleted: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  add_FrameNavigationStarting: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_FrameNavigationStarting: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  add_PermissionRequested: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_PermissionRequested: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  add_ScriptDialogOpening: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_ScriptDialogOpening: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  AddScriptToExecuteOnDocumentCreated: {
    parameters: ['pointer', 'pointer', 'function'],
    result: 'pointer',
  },
  RemoveScriptToExecuteOnDocumentCreated: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  ExecuteScript: {
    parameters: ['pointer', 'pointer', 'function'],
    result: 'pointer',
  },
  AddHostObjectToScript: {
    parameters: ['pointer', 'pointer', 'pointer'],
    result: 'pointer',
  },
  RemoveHostObjectFromScript: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  get_Source: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  add_SourceChanged: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_SourceChanged: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  Reload: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  get_CanGoBack: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  get_CanGoForward: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  GoBack: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  GoForward: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  Stop: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  add_ContentLoading: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_ContentLoading: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  add_ProcessFailed: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_ProcessFailed: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  get_Settings: {
    parameters: ['pointer'],
    result: 'pointer',
  },
  CapturePreview: {
    parameters: ['pointer', 'i32', 'pointer', 'function'],
    result: 'pointer',
  },
  get_BrowserProcessId: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  add_NewWindowRequested: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_NewWindowRequested: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  add_ContainsFullScreenElementChanged: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_ContainsFullScreenElementChanged: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  get_ContainsFullScreenElement: {
    parameters: ['pointer', 'pointer'],
    result: 'pointer',
  },
  add_WebResourceRequested: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_WebResourceRequested: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
  AddWebResourceRequestedFilter: {
    parameters: ['pointer', 'pointer', 'i32'],
    result: 'pointer',
  },
  RemoveWebResourceRequestedFilter: {
    parameters: ['pointer', 'pointer', 'i32'],
    result: 'pointer',
  },
  add_WindowCloseRequested: {
    parameters: ['pointer', 'function', 'pointer'],
    result: 'pointer',
  },
  remove_WindowCloseRequested: {
    parameters: ['pointer', 'buffer'],
    result: 'pointer',
  },
};
