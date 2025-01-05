#ifdef _WINDOWS
#include "./WebView2.hpp"

// Settings
static TCHAR WINDOW_CLASS_NAME[] = L"SampleWeapnWindow";
static TCHAR WINDOW_TITLE[] = L"Weapn";

struct DATA {
	HWND hWnd;
	WebView2Connector* webview2;
	EventRegistrationToken token;
} data;

// Import funcs.

typedef HRESULT (*ImportedCreateCoreWebView2Controller)(
	WebView2Connector* webview2,
	HWND hWnd,
	HRESULT(*callback)(HRESULT, ICoreWebView2Controller*)
);
ImportedCreateCoreWebView2Controller CreateCoreWebView2Controller;

typedef WebView2Connector* (*ImportedCreateWebView2Connector)(ICoreWebView2Environment* env);
ImportedCreateWebView2Connector CreateWebView2Connector;

typedef HRESULT (*Imported_CreateCoreWebView2EnvironmentWithOptions)(
	WebView2Connector* webview2,
	PCWSTR browserExecutableFolder,
	PCWSTR userDataFolder,
	ICoreWebView2EnvironmentOptions* environmentOptions,
	HRESULT(*callback)(HRESULT result, ICoreWebView2Environment* env)
);
Imported_CreateCoreWebView2EnvironmentWithOptions _CreateCoreWebView2EnvironmentWithOptions;

typedef HRESULT(*Importedput_Bounds)(WebView2Connector* webview2, RECT bounds);
Importedput_Bounds put_Bounds;

typedef WebView2Connector* (*ImportedInitControllers)(WebView2Connector* webview2, ICoreWebView2Controller* controller);
ImportedInitControllers InitControllers;

typedef HRESULT (*Importedget_CoreWebView2)(WebView2Connector* webview2);
Importedget_CoreWebView2 get_CoreWebView2;

typedef HRESULT (*Importedget_Settings)(WebView2Connector* webview2);
Importedget_Settings get_Settings;

typedef WebView2Connector* (*ImportedInitSettings)(WebView2Connector* webview2);
ImportedInitSettings InitSettings;

typedef HRESULT (*Importedput_IsScriptEnabled)(WebView2Connector* webview2, BOOL isScriptEnabled);
Importedput_IsScriptEnabled put_IsScriptEnabled;

typedef HRESULT (*Importedput_IsWebMessageEnabled)(WebView2Connector* webview2, BOOL isWebMessageEnabled);
Importedput_IsWebMessageEnabled put_IsWebMessageEnabled;

typedef HRESULT (*Importedput_AreDefaultScriptDialogsEnabled)(WebView2Connector* webview2, BOOL areDefaultScriptDialogsEnabled);
Importedput_AreDefaultScriptDialogsEnabled put_AreDefaultScriptDialogsEnabled;

typedef HRESULT (*Importedput_AreDevToolsEnabled)(WebView2Connector* webview2, BOOL areDevToolsEnabled);
Importedput_AreDevToolsEnabled put_AreDevToolsEnabled;

typedef HRESULT (*Importedput_IsStatusBarEnabled)(WebView2Connector* webview2, BOOL isStatusBarEnabled);
Importedput_IsStatusBarEnabled put_IsStatusBarEnabled;

typedef HRESULT (*Importedput_AreDefaultContextMenusEnabled)(WebView2Connector* webview2, BOOL enabled);
Importedput_AreDefaultContextMenusEnabled put_AreDefaultContextMenusEnabled;

typedef HRESULT (*Importedput_AreHostObjectsAllowed)(WebView2Connector* webview2, BOOL allowed);
Importedput_AreHostObjectsAllowed put_AreHostObjectsAllowed;

typedef HRESULT (*Importedput_IsBuiltInErrorPageEnabled)(WebView2Connector* webview2, BOOL enabled);
Importedput_IsBuiltInErrorPageEnabled put_IsBuiltInErrorPageEnabled;

typedef HRESULT (*Importedput_IsZoomControlEnabled)(WebView2Connector* webview2, BOOL enabled);
Importedput_IsZoomControlEnabled put_IsZoomControlEnabled;

void ExitError(int code) {
	DWORD error = GetLastError();
	exit(code);
}

void DebugLog(const WCHAR* message) {
	OutputDebugString(message);
}

void LoadDLL() {
	HMODULE hModule = LoadLibrary(L"../Debug/webview2.dll");
	if (hModule == NULL) {
		return;
	}
	CreateCoreWebView2Controller = (ImportedCreateCoreWebView2Controller)GetProcAddress(hModule, "CreateCoreWebView2Controller");
	CreateWebView2Connector = (ImportedCreateWebView2Connector)GetProcAddress(hModule, "CreateWebView2Connector");
	_CreateCoreWebView2EnvironmentWithOptions = (Imported_CreateCoreWebView2EnvironmentWithOptions)GetProcAddress(hModule, "_CreateCoreWebView2EnvironmentWithOptions");
	put_Bounds = (Importedput_Bounds)GetProcAddress(hModule, "put_Bounds");
	InitControllers = (ImportedInitControllers)GetProcAddress(hModule, "InitControllers");
	get_CoreWebView2 = (Importedget_CoreWebView2)GetProcAddress(hModule, "get_CoreWebView2");
	get_Settings = (Importedget_Settings)GetProcAddress(hModule, "get_Settings");
	InitSettings = (ImportedInitSettings)GetProcAddress(hModule, "InitSettings");
	put_IsScriptEnabled = (Importedput_IsScriptEnabled)GetProcAddress(hModule, "put_IsScriptEnabled");
	put_IsWebMessageEnabled = (Importedput_IsWebMessageEnabled)GetProcAddress(hModule, "put_IsWebMessageEnabled");
	put_AreDefaultScriptDialogsEnabled = (Importedput_AreDefaultScriptDialogsEnabled)GetProcAddress(hModule, "put_AreDefaultScriptDialogsEnabled");
	put_AreDevToolsEnabled = (Importedput_AreDevToolsEnabled)GetProcAddress(hModule, "put_AreDevToolsEnabled");
	put_IsStatusBarEnabled = (Importedput_IsStatusBarEnabled)GetProcAddress(hModule, "put_IsStatusBarEnabled");
	put_AreDefaultContextMenusEnabled = (Importedput_AreDefaultContextMenusEnabled)GetProcAddress(hModule, "put_AreDefaultContextMenusEnabled");
	put_AreHostObjectsAllowed = (Importedput_AreHostObjectsAllowed)GetProcAddress(hModule, "put_AreHostObjectsAllowed");
	put_IsBuiltInErrorPageEnabled = (Importedput_IsBuiltInErrorPageEnabled)GetProcAddress(hModule, "put_IsBuiltInErrorPageEnabled");
	put_IsZoomControlEnabled = (Importedput_IsZoomControlEnabled)GetProcAddress(hModule, "put_IsZoomControlEnabled");
}

void InitApp() {
#ifdef _CRTDBG_MAP_ALLOC
#  ifdef _DEBUG
	_CrtSetReportMode(_CRT_WARN, _CRTDBG_MODE_DEBUG);
	_CrtSetReportMode(_CRT_ERROR, _CRTDBG_MODE_DEBUG);
	_CrtSetReportMode(_CRT_ASSERT, _CRTDBG_MODE_DEBUG);
	_CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
#  endif
#endif
	DebugLog(L"InitApp\n");
	SetEnvironmentVariable(L"WEBVIEW2_USER_DATA_FOLDER", L".\\cache");

	HWND consoleWindow = GetConsoleWindow();
	if (consoleWindow) {
		//ShowWindow(consoleWindow, SW_HIDE);
		ShowWindowAsync(consoleWindow, SW_HIDE);
	}
}

void OnResizeScreen() {
	DebugLog(L"OnResizeScreen\n");
	if (data.webview2 == nullptr) {
		return;
	}
	RECT bounds;
	::GetClientRect(data.hWnd, &bounds);
	put_Bounds(data.webview2, bounds);
}

LRESULT WindowProcedure(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg) {
	case WM_CREATE: {
		//CREATESTRUCT* tpCreateSt = (CREATESTRUCT*)lParam;
		//ShowWindow(hWnd, SW_SHOWDEFAULT); // SW_SHOWDEFAULT
		//UpdateWindow(hWnd);
		break;
	}
	case WM_DESTROY: {
		PostQuitMessage(0);
		break;
	}
	case WM_SIZE:
		OnResizeScreen();
		break;
	}
	return DefWindowProcW(hWnd, msg, wParam, lParam);
}

int InitWindow(HINSTANCE hInstance, HWND* hWnd) {
	DebugLog(L"InitWindow\n");
	//*hWnd = test();
	DWORD style = WS_VISIBLE | WS_OVERLAPPEDWINDOW;
	DWORD exstyle = 0; // WS_EX_LAYERED;
	WNDCLASSEX wcex;

	UINT size = sizeof(WNDCLASSEX);
	memset(&wcex, 0, size);
	wcex.cbSize = size;
	wcex.style = CS_HREDRAW | CS_VREDRAW;
	wcex.lpfnWndProc = WindowProcedure;
	wcex.hCursor = LoadCursorW(nullptr, IDC_ARROW);
	wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
	wcex.lpszMenuName = nullptr;
	wcex.lpszClassName = WINDOW_CLASS_NAME;
	wcex.hIcon = LoadIconW(nullptr, IDI_APPLICATION);
	wcex.hIconSm = LoadIconW(nullptr, IDI_APPLICATION);
	wcex.hInstance = nullptr;// hInstance;

	if (!RegisterClassExW(&wcex)) {
		return 1;
	}

	*hWnd = CreateWindowEx(
		exstyle,
		wcex.lpszClassName,
		WINDOW_TITLE,
		style,
		CW_USEDEFAULT, CW_USEDEFAULT,
		400, 300,
		nullptr,
		nullptr,
		nullptr,//wcex.hInstance,
		nullptr
	);
	if (!*hWnd) {
		return 2;
	}

	return 0;
}

/*HRESULT CallbackAddRasterizationScaleChanged(ICoreWebView2Controller* sender, IUnknown* args) {
	double rasterizationScale;
	data.webview2->get_RasterizationScale(&rasterizationScale);
	DebugLog(L"OnRasterizationScaleChanged:");
	WCHAR value[32];
	swprintf_s(value, 32, L"%f\n", rasterizationScale);
	DebugLog(value);
	return S_OK;
}*/

HRESULT CreateCoreWebView2ControllerCallback(HRESULT result, ICoreWebView2Controller* controller) {
	if (controller != nullptr)
	{
		InitControllers(data.webview2, controller);
		get_CoreWebView2(data.webview2);
		//data.webview2->add_RasterizationScaleChanged(CallbackAddRasterizationScaleChanged, &(data.token));
	}

	get_Settings(data.webview2);
	InitSettings(data.webview2);

	// Resize WebView to fit the bounds of the parent window
	OnResizeScreen();

	// On create webview2
	put_IsScriptEnabled(data.webview2, true);
	put_IsWebMessageEnabled(data.webview2, true);
	put_AreDefaultScriptDialogsEnabled(data.webview2, true);
	put_AreDevToolsEnabled(data.webview2, true);
	put_IsStatusBarEnabled(data.webview2, false);
	put_AreDefaultContextMenusEnabled(data.webview2, false);
	put_AreHostObjectsAllowed(data.webview2, true);
	put_IsBuiltInErrorPageEnabled(data.webview2, true);
	put_IsZoomControlEnabled(data.webview2, false);
	//data.webview2->put_UserAgent();
	//data.webview2->put_AreBrowserAcceleratorKeysEnabled(false);
	//data.webview2->put_IsGeneralAutofillEnabled(false);
	//data.webview2->put_IsPasswordAutosaveEnabled(false);
	//data.webview2->put_IsPinchZoomEnabled(false);
	//data.webview2->put_IsSwipeNavigationEnabled(false);

	data.webview2->Navigate(L"https://www.google.co.jp/");

	return S_OK;
}

HRESULT CreateCoreWebView2EnvironmentWithOptionsCallback(HRESULT result, ICoreWebView2Environment* env) {
	HWND hWnd = data.hWnd;

	return CreateCoreWebView2Controller(data.webview2, data.hWnd, CreateCoreWebView2ControllerCallback);
}

int InitWebView(HWND hWnd) {
	DebugLog(L"InitWebView\n");
	HRESULT hresult;
	data.webview2 = CreateWebView2Connector(nullptr);

	hresult = _CreateCoreWebView2EnvironmentWithOptions(
		data.webview2,
		nullptr,
		nullptr,
		nullptr,
		CreateCoreWebView2EnvironmentWithOptionsCallback
	);

	return hresult;
}

//int APIENTRY WinMain(_In_ HINSTANCE hInstance, _In_opt_ HINSTANCE hPrevInstance, _In_ LPSTR lpCmdLine, _In_ int nCmdShow) {
int main() {
	LoadDLL();

	InitApp();

	data.hWnd = nullptr;
	data.webview2 = nullptr;
	HINSTANCE hInstance = GetModuleHandle(0);

	int error = InitWindow(hInstance, &(data.hWnd));
	if (error != 0)
	{
		ExitError(error);
	}

	InitWebView(data.hWnd);

	DebugLog(L"Start loop.\n");
	MSG msg;
	while (GetMessageW(&msg, nullptr, 0, 0))
	{
		TranslateMessage(&msg);
		DispatchMessageW(&msg);
	}

	return (int)msg.wParam;
}
#endif
