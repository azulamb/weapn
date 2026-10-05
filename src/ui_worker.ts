import { WebViewWindow } from './webview_window.ts';
import { winApi } from './libs/win_api.ts';
import {
  type Deferral,
  WebMessageReceivedEventArgs,
  WebResourceRequestedEventArgs,
} from './libs/webview2.ts';
import { IStream } from '@azulamb/webview2';
import type { FromUI, ResourceResult, ToUI, UIOptions } from './ui_protocol.ts';
import { isToUI } from './ui_protocol.ts';
import type { WeapnLogger } from './types.ts';
import { backgroundColorChannels } from './support/background_color.ts';

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
  let previousBackground: string | undefined;
  let backgroundEnvironmentSet = false;
  function restoreBackgroundEnvironment(): void {
    if (!backgroundEnvironmentSet) return;
    if (previousBackground === undefined) {
      Deno.env.delete('WEBVIEW2_DEFAULT_BACKGROUND_COLOR');
    } else {Deno.env.set(
        'WEBVIEW2_DEFAULT_BACKGROUND_COLOR',
        previousBackground,
      );}
    backgroundEnvironmentSet = false;
  }
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
  const log = (level: keyof WeapnLogger) => (...messages: unknown[]) => {
    post({
      type: 'log',
      level,
      messages: messages.map(String),
    });
  };
  const logger: WeapnLogger = {
    log: log('log'),
    info: log('info'),
    debug: log('debug'),
    warn: log('warn'),
    error: log('error'),
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
      if (response.body.length > options.maxResponseBytes) {
        throw new Error('Response exceeds configured byte limit.');
      }
      // SHCreateMemStream copies the bytes. Read never calls back into JavaScript.
      streamPointer = winApi.shlwapi.SHCreateMemStream(response.body);
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
    restoreBackgroundEnvironment();
    for (const [id] of requests) {
      try {
        respond(id, {
          status: 503,
          statusText: 'Service Unavailable',
          headers: [],
          body: new Uint8Array(),
        });
      } catch (error) {
        logger.error(error);
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
      window.closeSizing();
    }
    running = false;
    if (initialized) {
      winApi.ole.CoUninitialize();
      initialized = false;
    }
  }
  async function fail(error: unknown): Promise<void> {
    try {
      await stop();
    } catch (cleanup) {
      logger.error(cleanup);
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
    const initStartedAt = performance.now();
    if (window) {
      throw new Error('UI Worker is already initialized.');
    }
    options = config;
    if (options.transparent || options.backgroundColor !== undefined) {
      previousBackground = Deno.env.get('WEBVIEW2_DEFAULT_BACKGROUND_COLOR');
      Deno.env.set(
        'WEBVIEW2_DEFAULT_BACKGROUND_COLOR',
        options.transparent
          ? '00000000'
          : 'FF' + options.backgroundColor!.slice(1).toUpperCase(),
      );
      backgroundEnvironmentSet = true;
    }
    const hr = winApi.ole.CoInitializeEx(null, 2);
    if (hr < 0) {
      throw new Error(`CoInitializeEx failed: ${hr}`);
    }
    initialized = true;
    Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', options.userDataFolder);
    window = new WebViewWindow(logger);
    const timing = (stage: string, durationMs: number) => {
      if (options.startupTiming) post({ type: 'timing', stage, durationMs });
    };
    window.onStartupTiming = timing;
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
    window.initWindow(options.backgroundColor, options.transparent)
      .createWindow({
        title: options.title,
        width: options.width,
        height: options.height,
        decorations: options.decorations,
      });
    running = true;
    timing(
      'UI init → native window created',
      performance.now() - initStartedAt,
    );
    void pump();
    window.initWebView(() => {
      try {
        const webview = window!.webview2;
        if (options.startupTiming) {
          let navigationStartedAt: number | undefined;
          let navigationID: bigint | undefined;
          webview.core.addNavigationStarting((_sender, args) => {
            navigationStartedAt = performance.now();
            navigationID = args.NavigationId;
            return 0;
          });
          webview.core.addNavigationCompleted((_sender, args) => {
            if (
              navigationStartedAt !== undefined &&
              args.NavigationId === navigationID
            ) {
              timing(
                `Navigation completed (success=${args.IsSuccess}, status=${args.WebErrorStatus})`,
                performance.now() - navigationStartedAt,
              );
              navigationStartedAt = undefined;
            }
            return 0;
          });
        }
        if (options.transparent) {
          webview.controllers.defaultBackgroundColor = {
            alpha: 0,
            red: 0,
            green: 0,
            blue: 0,
          };
        } else if (options.backgroundColor !== undefined) {
          webview.controllers.defaultBackgroundColor = backgroundColorChannels(
            options.backgroundColor,
          );
        }
        restoreBackgroundEnvironment();
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
            logger.error(error);
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
                  post({ type: 'cancel', id });
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
              if (requests.size > options.maxConcurrentRequests) {
                respond(id, {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: [],
                  body: new Uint8Array(),
                });
              } else if (method !== 'GET' && method !== 'HEAD') {
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
    if (!isToUI(event.data)) {
      await fail(new Error('Invalid main-to-UI message.'));
      return;
    }
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
            winApi.user.SetWindowText(window.windowHandle, message.value);
            break;
          case 'navigate': {
            const result = window.webview2.core.navigate(
              message.value,
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
