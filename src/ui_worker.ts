import { WebViewWindow } from './webview_window.ts';
import { winApi } from './libs/win_api.ts';
import {
  type Deferral,
  WebMessageReceivedEventArgs,
  WebResourceRequestedEventArgs,
} from './libs/webview2.ts';
import { IStream } from '@azulamb/webview2';
import type { FromUI, ResourceResult, ToUI, UIOptions } from './ui_protocol.ts';

const ole = Deno.dlopen('ole32.dll', {
  CoInitializeEx: { parameters: ['pointer', 'u32'], result: 'i32' },
  CoUninitialize: { parameters: [], result: 'void' },
});
const shell = Deno.dlopen('shlwapi.dll', {
  SHCreateMemStream: { parameters: ['buffer', 'u32'], result: 'pointer' },
});

function release(pointer: Deno.PointerValue): void {
  if (!pointer) {
    return;
  }
  const table = new Deno.UnsafePointerView(pointer).getPointer();
  const definition = { parameters: ['pointer'], result: 'u32' } as const;
  const fn = new Deno.UnsafePointerView(table!).getPointer<typeof definition>(
    16,
  );
  new Deno.UnsafeFnPointer(fn!, definition).call(pointer);
}

/** All calls here stay on this Worker's STA thread; no FFI nonblocking calls. */
export function startUIWorker(): void {
  const scope = globalThis as unknown as {
    onmessage: (event: MessageEvent<ToUI>) => void;
    postMessage: (message: FromUI) => void;
    close: () => void;
  };
  let window: WebViewWindow | undefined;
  let options: UIOptions;
  let running = false;
  let initialized = false;
  let nextRequest = 0;
  const requests = new Map<
    number,
    {
      args: WebResourceRequestedEventArgs;
      argsPointer: Deno.PointerValue;
      deferral: Deferral;
      timer: ReturnType<typeof setTimeout>;
    }
  >();
  const post = (message: FromUI) => {
    return scope.postMessage(message);
  };

  function respond(id: number, response: ResourceResult): void {
    const pending = requests.get(id);
    if (!pending || !window) {
      return;
    }
    requests.delete(id);
    clearTimeout(pending.timer);
    let streamPointer: Deno.PointerValue = null;
    let responsePointer: Deno.PointerValue = null;
    try {
      // SHCreateMemStream copies the bytes. Read never calls back into JavaScript.
      streamPointer = shell.symbols.SHCreateMemStream(
        response.body,
        response.body.length,
      );
      if (!streamPointer) {
        throw new Error('SHCreateMemStream failed.');
      }
      const stream = new IStream(window.webview2.lib);
      stream.setPointer(streamPointer);
      const native = window.webview2.createWebResourceResponse(
        stream,
        response.status,
        response.statusText || 'OK',
        response.headers.map(([name, value]) => `${name}: ${value}`).join(
          '\r\n',
        ),
      );
      responsePointer = native.pointer;
      if (!responsePointer) {
        throw new Error('CreateWebResourceResponse failed.');
      }
      pending.args.Response = native;
    } finally {
      release(responsePointer);
      release(streamPointer);
      pending.deferral.complete();
      release(pending.deferral.getPointer());
      release(pending.argsPointer);
    }
  }

  let stopping: Promise<void> | undefined;
  function stop(): Promise<void> {
    return stopping ??= cleanup();
  }
  async function cleanup(): Promise<void> {
    for (const [id] of requests) {
      try {
        respond(id, {
          status: 503,
          statusText: 'Service Unavailable',
          headers: [],
          body: new Uint8Array(),
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (window) {
      if (window.webview2) {
        window.webview2.close();
        await window.webview2.closed;
      }
      if (window.windowHandle) winApi.user.DestroyWindow(window.windowHandle);
      const unregistered = winApi.user.UnregisterClass(
        window.windowClass.lpszClassName,
        winApi.kernel.GetModuleHandle(),
      );
      if (unregistered) window.windowClass.closeWindowProcedure();
    }
    running = false;
    if (initialized) {
      ole.symbols.CoUninitialize();
      initialized = false;
    }
  }
  async function fail(error: unknown): Promise<void> {
    try {
      await stop();
    } catch (cleanup) {
      console.error(cleanup);
    }
    post({
      type: 'fatal',
      error: error instanceof Error ? error.message : String(error),
    });
    scope.close();
  }
  async function pump(): Promise<void> {
    const msg = winApi.create.message();
    try {
      while (running) {
        for (let count = 0; count < 64; ++count) {
          if (!winApi.user.PeekMessage(msg.pointer, null, 0, 0, 1)) break;
          if (msg.message === 0x12) {
            await stop();
            post({ type: 'closed' });
            scope.close();
            return;
          }
          winApi.user.TranslateMessage(msg.pointer);
          winApi.user.DispatchMessage(msg.pointer);
        }
        await new Promise((resolve) => {
          return setTimeout(resolve, 8);
        });
      }
    } catch (error) {
      fail(error);
    }
  }

  function init(config: UIOptions): void {
    if (window) {
      throw new Error('UI Worker is already initialized.');
    }
    options = config;
    const hr = ole.symbols.CoInitializeEx(null, 2);
    if (hr < 0) {
      throw new Error(`CoInitializeEx failed: ${hr}`);
    }
    initialized = true;
    Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', options.userDataFolder);
    window = new WebViewWindow(console);
    window.onWindowEvent = (message) => {
      return post({ type: 'window', message });
    };
    window.onInitError = fail;
    window.init(winApi.kernel.GetModuleHandle());
    window.windowClass.setClassName(`WeapnAppWindow-${crypto.randomUUID()}`);
    try {
      window.loadDll(options.dllPath);
    } catch (error) {
      throw new Error(`Failed to load ${options.dllPath}: ${error}`);
    }
    window.initWindow().createWindow({
      title: options.title,
      width: options.width,
      height: options.height,
    });
    running = true;
    void pump();
    window.initWebView(() => {
      try {
        const webview = window!.webview2;
        webview.settings.areDevToolsEnabled = options.developerTools ?? false;
        for (const mapping of options.virtualHosts ?? []) {
          const result = webview.core.setVirtualHostNameToFolderMapping(
            mapping.hostName,
            mapping.folderPath,
            { [mapping.accessKind]: true },
          );
          if (result < 0) {
            throw new Error(
              `Virtual host mapping failed (${mapping.hostName}): ${result}`,
            );
          }
        }
        webview.core.addWebMessageReceived((_sender, pointer) => {
          try {
            const args = new WebMessageReceivedEventArgs(webview.lib, pointer);
            post({
              type: 'message',
              source: args.Source(),
              data: args.WebMessageAsJson<unknown>(),
            });
          } catch (error) {
            console.error(error);
          }
          return 0;
        });
        if (options.resourceFilter) {
          const filterResult = webview.core.addWebResourceRequestedFilter(
            options.resourceFilter,
            0,
          );
          if (filterResult < 0) {
            throw new Error(`Resource filter failed: ${filterResult}`);
          }
          webview.core.addWebResourceRequested((_sender, pointer) => {
            try {
              const args = new WebResourceRequestedEventArgs(
                webview.lib,
                pointer,
              );
              const request = args.Request;
              const method = request.Method;
              const url = request.Uri;
              request.close();
              const deferral = args.getDeferral();
              const id = ++nextRequest;
              // Retain the event arguments beyond this callback's lifetime.
              const table = new Deno.UnsafePointerView(pointer!).getPointer();
              new Deno.UnsafeFnPointer(
                new Deno.UnsafePointerView(table!).getPointer(8)!,
                { parameters: ['pointer'], result: 'u32' },
              ).call(pointer);
              const timer = setTimeout(() => {
                try {
                  respond(id, {
                    status: 504,
                    statusText: 'Gateway Timeout',
                    headers: [],
                    body: new Uint8Array(),
                  });
                } catch (error) {
                  fail(error);
                }
              }, options.resourceTimeoutMs);
              requests.set(id, { args, argsPointer: pointer, deferral, timer });
              if (method !== 'GET' && method !== 'HEAD') {
                respond(id, {
                  status: 405,
                  statusText: 'Method Not Allowed',
                  headers: [['Allow', 'GET, HEAD']],
                  body: new Uint8Array(),
                });
              } else post({ type: 'request', id, url, method });
            } catch (error) {
              fail(error);
            }
            return 0;
          });
        }
        post({ type: 'ready' });
      } catch (error) {
        fail(error);
      }
    });
  }

  scope.onmessage = async (event) => {
    const message = event.data;
    if (message.type === 'command') {
      try {
        if (!window?.isPrepared()) {
          throw new Error('Window is not ready.');
        }
        switch (message.action) {
          case 'maximize':
            winApi.user.ShowWindow(window.windowHandle, 3);
            break;
          case 'minimize':
            winApi.user.ShowWindow(window.windowHandle, 6);
            break;
          case 'restore':
            winApi.user.ShowWindow(window.windowHandle, 9);
            break;
          case 'title':
            winApi.user.SetWindowText(window.windowHandle, message.value ?? '');
            break;
          case 'navigate': {
            const result = window.webview2.core.navigate(
              message.value ?? 'about:blank',
            );
            if (result < 0) {
              throw new Error(`Navigate failed: ${result}`);
            }
            break;
          }
          case 'close':
            await stop();
            break;
        }
        post({ type: 'result', id: message.id });
        if (message.action === 'close') {
          post({ type: 'closed' });
          scope.close();
        }
      } catch (error) {
        post({ type: 'result', id: message.id, error: String(error) });
      }
    } else {
      try {
        if (message.type === 'init') init(message.options);
        else respond(message.id, message.response);
      } catch (error) {
        fail(error);
      }
    }
  };
}
