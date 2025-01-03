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

typedef WebView2Connector* (*ImportedCreateWebView2Connector)(
	ICoreWebView2Environment* env
);
ImportedCreateWebView2Connector CreateWebView2Connector;

typedef HRESULT (*Imported_CreateCoreWebView2EnvironmentWithOptions)(
	WebView2Connector* webview2,
	PCWSTR browserExecutableFolder,
	PCWSTR userDataFolder,
	ICoreWebView2EnvironmentOptions* environmentOptions,
	HRESULT(*callback)(HRESULT result, ICoreWebView2Environment* env)
);
Imported_CreateCoreWebView2EnvironmentWithOptions _CreateCoreWebView2EnvironmentWithOptions;

void ExitError(int code) {
	DWORD error = GetLastError();
	exit(code);
}

void DebugLog(const WCHAR* message) {
	OutputDebugString(message);
}

void LoadDLL() {
	HMODULE hModule = LoadLibrary(L"../Debug/WebView2.dll");
	CreateCoreWebView2Controller = (ImportedCreateCoreWebView2Controller)GetProcAddress(hModule, "CreateCoreWebView2Controller");
	CreateWebView2Connector = (ImportedCreateWebView2Connector)GetProcAddress(hModule, "CreateWebView2Connector");
	_CreateCoreWebView2EnvironmentWithOptions = (Imported_CreateCoreWebView2EnvironmentWithOptions)GetProcAddress(hModule, "_CreateCoreWebView2EnvironmentWithOptions");
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
	data.webview2->put_Bounds(bounds);
}

LRESULT WindowProcedure(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg) {
	case WM_CREATE: {
		CREATESTRUCT* tpCreateSt = (CREATESTRUCT*)lParam;
		ShowWindow(hWnd, SW_SHOWDEFAULT); // SW_SHOWDEFAULT
		UpdateWindow(hWnd);
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
	wcex.hInstance = hInstance;

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
		wcex.hInstance,
		nullptr
	);
	if (!*hWnd) {
		return 2;
	}

	//ShowWindow(hWnd, nCmdShow);
	//UpdateWindow(*hWnd);

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
		data.webview2->initControllers(controller);
		data.webview2->get_CoreWebView2();
		//data.webview2->add_RasterizationScaleChanged(CallbackAddRasterizationScaleChanged, &(data.token));
	}

	data.webview2->get_Settings();
	data.webview2->initSettings();

	// Resize WebView to fit the bounds of the parent window
	OnResizeScreen();

	// On create webview2
	data.webview2->put_IsScriptEnabled(true);
	data.webview2->put_IsWebMessageEnabled(true);
	data.webview2->put_AreDefaultScriptDialogsEnabled(true);
	data.webview2->put_AreDevToolsEnabled(true);
	data.webview2->put_IsStatusBarEnabled(false);
	data.webview2->put_AreDefaultContextMenusEnabled(false);
	data.webview2->put_AreHostObjectsAllowed(true);
	data.webview2->put_IsBuiltInErrorPageEnabled(true);
	data.webview2->put_IsZoomControlEnabled(false);
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

	//data.webview2->CreateCoreWebView2Controller(data.hWnd, CreateCoreWebView2ControllerCallback);
	CreateCoreWebView2Controller(data.webview2, data.hWnd, CreateCoreWebView2ControllerCallback);
	/*env->CreateCoreWebView2Controller(hWnd, Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
		[hWnd](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT
		{
			DebugLog(L"CreateCoreWebView2ControllerCallback\n");
			if (controller != nullptr)
			{
				data.webview2->initControllers(controller);
				data.webview2->get_CoreWebView2();
				//data.webview2->add_RasterizationScaleChanged(CallbackAddRasterizationScaleChanged, &(data.token));
			}

			data.webview2->get_Settings();
			data.webview2->initSettings();

			// Resize WebView to fit the bounds of the parent window
			OnResizeScreen();

			// On create webview2
			data.webview2->put_IsScriptEnabled(true);
			data.webview2->put_IsWebMessageEnabled(true);
			data.webview2->put_AreDefaultScriptDialogsEnabled(true);
			data.webview2->put_AreDevToolsEnabled(true);
			data.webview2->put_IsStatusBarEnabled(false);
			data.webview2->put_AreDefaultContextMenusEnabled(false);
			data.webview2->put_AreHostObjectsAllowed(true);
			data.webview2->put_IsBuiltInErrorPageEnabled(true);
			data.webview2->put_IsZoomControlEnabled(false);
			//data.webview2->put_UserAgent();
			//data.webview2->put_AreBrowserAcceleratorKeysEnabled(false);
			//data.webview2->put_IsGeneralAutofillEnabled(false);
			//data.webview2->put_IsPasswordAutosaveEnabled(false);
			//data.webview2->put_IsPinchZoomEnabled(false);
			//data.webview2->put_IsSwipeNavigationEnabled(false);

			data.webview2->Navigate(L"https://www.google.co.jp/");

			return S_OK;
		}).Get());*/
	return S_OK;
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

	return 0;
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

	MSG msg;
	while (GetMessageW(&msg, nullptr, 0, 0))
	{
		TranslateMessage(&msg);
		DispatchMessageW(&msg);
	}

	return (int)msg.wParam;
}
#endif
