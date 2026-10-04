import { dirname, fromFileUrl, isAbsolute, join, resolve } from '@std/path';
import { ensureDLL } from '@azulamb/webview2/copy';
import { readResponseBody, waitForResponse } from './support/response.ts';
import { isFromUI } from './ui_protocol.ts';
import { isBackgroundColor } from './support/background_color.ts';
import type { WeapnLogger } from './types.ts';
export type { WeapnLogger } from './types.ts';
import { isCompiled } from './support/compile.ts';
import type {
  FromUI,
  ResourceResult,
  ToUI,
  UIOptions,
  VirtualHostMapping,
  WindowCommand,
} from './ui_protocol.ts';

let workerURL = new URL('./ui_worker_entry.ts', import.meta.url).href;
/** Used by the build entrypoint to select the embedded Worker. */
export function setUIWorkerURL(url: string | URL): void {
  workerURL = url.toString();
}

export interface WorkerAppOptions {
  dllPath?: string;
  userDataFolder?: string;
  title?: string;
  width?: number;
  height?: number;
  developerTools?: boolean;
  /** Opaque initial background for the native window and WebView2, in #RRGGBB format. */
  backgroundColor?: string;
  /** Log startup phase durations through logger.info(). */
  startupTiming?: boolean;
  resourceFilter?: string;
  resourceTimeoutMs?: number;
  startupTimeoutMs?: number;
  maxConcurrentRequests?: number;
  maxResponseBytes?: number;
  dllVersion?: string;
  logger?: WeapnLogger;
}
export interface WebMessage {
  source: string;
  data: unknown;
}
export interface WindowController {
  maximize(): Promise<void>;
  minimize(): Promise<void>;
  restore(): Promise<void>;
  setTitle(title: string): Promise<void>;
  close(): Promise<void>;
}

/** Main-thread facade; HWNDs and COM objects remain inside the UI Worker. */
export class WeapnApp {
  private worker?: Worker;
  private nextID = 0;
  private pending = new Map<
    number,
    { resolve: () => void; reject: (error: Error) => void }
  >();
  private messageHandler?: (message: WebMessage) => unknown;
  private windowHandler?: (event: { message: number }) => unknown;
  private resourceHandler?: (request: Request) => Response | Promise<Response>;
  private virtualHosts = new Map<string, VirtualHostMapping>();
  private activeRequests = new Map<number, AbortController>();
  private abort = new AbortController();
  private ready?: { resolve: () => void; reject: (error: Error) => void };
  private resolveClosed!: () => void;
  private started = false;
  private stopped = false;
  readonly closed: Promise<void> = new Promise<void>((resolve) => {
    this.resolveClosed = resolve;
  });
  readonly window: WindowController = {
    maximize: (): Promise<void> => {
      return this.command({ action: 'maximize' });
    },
    minimize: (): Promise<void> => {
      return this.command({ action: 'minimize' });
    },
    restore: (): Promise<void> => {
      return this.command({ action: 'restore' });
    },
    setTitle: (title: string): Promise<void> => {
      return this.command({ action: 'title', value: title });
    },
    close: (): Promise<void> => {
      return this.command({ action: 'close' });
    },
  };

  constructor(
    private meta: { url: string },
    private options: WorkerAppOptions = {},
  ) {}

  onMessage(handler: (message: WebMessage) => unknown): this {
    this.messageHandler = handler;
    return this;
  }
  onWindowEvent(handler: (event: { message: number }) => unknown): this {
    this.windowHandler = handler;
    return this;
  }
  /** GET/HEAD interception. Request bodies and streaming responses are not supported. */
  onResourceRequest(
    handler: (request: Request) => Response | Promise<Response>,
  ): this {
    if (this.started) {
      throw new Error('Register resource handlers before start().');
    }
    this.resourceHandler = handler;
    return this;
  }
  setUrl(url: string): Promise<void> {
    return this.command({ action: 'navigate', value: url });
  }

  /** Register before start(). WebView2 reads a physical directory; exe-embedded assets need mountAssets(). */
  setVirtualHostNameToFolderMapping(
    hostName: string,
    directory: string | URL,
    accessKind: 'deny' | 'allow' | 'denyCors' = 'denyCors',
  ): this {
    if (this.started) throw new Error('Register virtual hosts before start().');
    if (!hostName.trim()) {
      throw new TypeError('A virtual host name is required.');
    }
    const folderPath = directory instanceof URL
      ? fromFileUrl(directory)
      : resolve(directory);
    this.virtualHosts.set(hostName, { hostName, folderPath, accessKind });
    return this;
  }

  async start(): Promise<void> {
    const startedAt = performance.now();
    if (this.started) {
      throw new Error('An application can only be started once.');
    }
    this.started = true;
    const options = this.options;
    if (
      options.backgroundColor !== undefined &&
      !isBackgroundColor(options.backgroundColor)
    ) {
      const error = new TypeError('backgroundColor must be #RRGGBB.');
      this.finish(error);
      throw error;
    }
    const timeout = options.startupTimeoutMs ?? 30_000;
    const resourceTimeout = options.resourceTimeoutMs ?? 30_000;
    const maxConcurrentRequests = options.maxConcurrentRequests ?? 64;
    const maxResponseBytes = options.maxResponseBytes ?? 64 * 1024 * 1024;
    if (
      !Number.isSafeInteger(timeout) || timeout <= 0 ||
      !Number.isSafeInteger(resourceTimeout) || resourceTimeout <= 0 ||
      !Number.isSafeInteger(maxConcurrentRequests) ||
      maxConcurrentRequests <= 0 ||
      !Number.isSafeInteger(maxResponseBytes) || maxResponseBytes <= 0 ||
      maxResponseBytes > 0xFFFFFFFF
    ) {
      this.finish(new Error('Timeouts must be positive finite numbers.'));
      throw new Error('Timeouts must be positive finite numbers.');
    }
    const compiled = isCompiled(new URL(this.meta.url));
    const base = compiled ? dirname(Deno.execPath()) : Deno.cwd();
    const absolute = (path: string) =>
      isAbsolute(path) ? path : join(base, path);
    const dllPath = absolute(options.dllPath ?? 'webview2.dll');
    const ready = new Promise<void>((resolve, reject) => {
      this.ready = { resolve, reject };
    });
    void ready.catch(() => {});
    const timer = setTimeout(
      () => {
        return this.finish(new Error('UI Worker startup timed out.'));
      },
      timeout,
    );
    try {
      const dllStartedAt = performance.now();
      if (!compiled && options.dllPath === undefined) {
        await Promise.race([
          ensureDLL(dllPath, {
            signal: this.abort.signal,
            expectedVersion: options.dllVersion,
          }),
          ready,
        ]);
      } else if (options.dllVersion) {
        await Promise.race([
          ensureDLL(dllPath, {
            signal: this.abort.signal,
            expectedVersion: options.dllVersion,
            existingOnly: true,
          }),
          ready,
        ]);
      }
      this.abort.signal.throwIfAborted();
      if (options.startupTiming) {
        (options.logger ?? console).info(
          `[Weapn timing] DLL preparation: ${
            (performance.now() - dllStartedAt).toFixed(1)
          } ms`,
        );
      }
      const workerStartedAt = performance.now();
      this.worker = new Worker(workerURL, { type: 'module' });
      this.worker.onmessage = (event: MessageEvent<unknown>) => {
        if (!isFromUI(event.data)) {
          this.finish(new Error('Invalid UI Worker message.'));
          return;
        }
        void this.receive(event.data);
      };
      this.worker.onerror = (event) => {
        event.preventDefault();
        this.finish(new Error(event.message));
      };
      this.worker.onmessageerror = () =>
        this.finish(new Error('Invalid UI Worker message.'));
      const init: UIOptions = {
        dllPath,
        userDataFolder: absolute(options.userDataFolder ?? './.weapn-data'),
        title: options.title,
        width: options.width,
        height: options.height,
        developerTools: options.developerTools,
        backgroundColor: options.backgroundColor,
        startupTiming: options.startupTiming,
        resourceFilter: this.resourceHandler
          ? options.resourceFilter ?? 'https://app.example/*'
          : undefined,
        resourceTimeoutMs: resourceTimeout,
        maxConcurrentRequests,
        maxResponseBytes,
        virtualHosts: [...this.virtualHosts.values()],
      };
      this.send({ type: 'init', options: init });
      await ready;
      if (options.startupTiming) {
        (options.logger ?? console).info(
          `[Weapn timing] Worker creation → UI ready: ${
            (performance.now() - workerStartedAt).toFixed(1)
          } ms`,
        );
        (options.logger ?? console).info(
          `[Weapn timing] start() total: ${
            (performance.now() - startedAt).toFixed(1)
          } ms`,
        );
      }
    } catch (error) {
      this.finish(error instanceof Error ? error : new Error(String(error)));
      // Also consume the startup rejection if construction or postMessage failed.
      await ready.catch(() => {});
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  /** Static assets are resolved relative to the application module, including in an exe. */
  mountAssets(directory: URL, origin = 'https://app.example'): this {
    const root = new URL(
      directory.href.endsWith('/') ? directory.href : directory.href + '/',
    );
    const host = new URL(origin).origin;
    this.options.resourceFilter = host + '/*';
    return this.onResourceRequest(async (request) => {
      const url = new URL(request.url);
      if (url.origin !== host) {
        return new Response(null, { status: 404 });
      }
      const path = decodeURIComponent(url.pathname);
      if (
        path.includes('\\') || path.includes('\0') ||
        path.split('/').includes('..')
      ) {
        return new Response(null, { status: 403 });
      }
      const relative = path.replace(/^\/+/, '') || 'index.html';
      // File URLs, not the executable directory, address Deno's embedded assets.
      const file = new URL(root);
      file.pathname += relative.split('/').map(encodeURIComponent).join('/');
      try {
        const stat = await Deno.stat(file);
        if (stat.size > (this.options.maxResponseBytes ?? 64 * 1024 * 1024)) {
          throw new RangeError('Asset exceeds response byte limit.');
        }
        const bytes = request.method === 'HEAD'
          ? null
          : await Deno.readFile(file, { signal: request.signal });
        const extension = relative.split('.').at(-1)?.toLowerCase() ?? '';
        const mime: Record<string, string> = {
          html: 'text/html; charset=utf-8',
          css: 'text/css; charset=utf-8',
          js: 'text/javascript; charset=utf-8',
          mjs: 'text/javascript; charset=utf-8',
          json: 'application/json',
          svg: 'image/svg+xml',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          webp: 'image/webp',
          ico: 'image/x-icon',
          woff: 'font/woff',
          woff2: 'font/woff2',
        };
        return new Response(request.method === 'HEAD' ? null : bytes, {
          headers: {
            'Content-Type': mime[extension] ?? 'application/octet-stream',
          },
        });
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          return new Response(null, { status: 404 });
        }
        throw error;
      }
    });
  }

  private send(message: ToUI, transfer: Transferable[] = []): void {
    if (!this.worker || this.stopped) {
      throw new Error('UI Worker is not running.');
    }
    this.worker.postMessage(message, transfer);
  }
  private async command(command: WindowCommand): Promise<void> {
    if (!this.started || this.ready || this.stopped) {
      throw new Error('Call and await start() before window operations.');
    }
    const id = ++this.nextID;
    return await new Promise<void>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try {
        this.send({ type: 'command', id, ...command });
      } catch (error) {
        this.pending.delete(id);
        reject(error);
      }
    });
  }
  private async receive(message: FromUI): Promise<void> {
    if (this.stopped) {
      return;
    }
    switch (message.type) {
      case 'timing':
        if (this.options.startupTiming) {
          (this.options.logger ?? console).info(
            `[Weapn timing] ${message.stage}: ${
              message.durationMs.toFixed(1)
            } ms`,
          );
        }
        break;
      case 'log':
        (this.options.logger ?? console)[message.level](...message.messages);
        break;
      case 'cancel':
        this.activeRequests.get(message.id)?.abort(
          new Error('Resource request cancelled by UI.'),
        );
        break;
      case 'ready':
        this.ready?.resolve();
        this.ready = undefined;
        break;
      case 'fatal':
        this.finish(new Error(message.error));
        break;
      case 'closed':
        this.finish();
        break;
      case 'result': {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending?.reject(new Error(message.error));
        else pending?.resolve();
        break;
      }
      case 'message':
      case 'window':
        try {
          await (message.type === 'message'
            ? this.messageHandler?.(message)
            : this.windowHandler?.(message));
        } catch (error) {
          (this.options.logger ?? console).error(
            'Weapn event handler failed:',
            error,
          );
        }
        break;
      case 'request': {
        const requestStartedAt = performance.now();
        if (
          this.activeRequests.size >= (this.options.maxConcurrentRequests ?? 64)
        ) {
          this.send({
            type: 'response',
            id: message.id,
            response: {
              status: 503,
              statusText: 'Service Unavailable',
              headers: [],
              body: new Uint8Array(),
            },
          });
          break;
        }
        const controller = new AbortController();
        this.activeRequests.set(message.id, controller);
        const timer = setTimeout(
          () => controller.abort(new Error('Resource request timed out.')),
          this.options.resourceTimeoutMs ?? 30_000,
        );
        let response: Response;
        try {
          response = await waitForResponse(
            Promise.resolve().then(() =>
              this.resourceHandler!(
                new Request(message.url, {
                  method: message.method,
                  signal: controller.signal,
                }),
              )
            ),
            controller.signal,
          );
          if (!(response instanceof Response)) {
            throw new Error('Resource handler must return a Response.');
          }
          const body = await readResponseBody(
            response,
            this.options.maxResponseBytes ?? 64 * 1024 * 1024,
            controller.signal,
          );
          const result: ResourceResult = {
            status: response.status,
            statusText: response.statusText,
            headers: [...response.headers],
            body,
          };
          if (!this.stopped) {
            this.send({ type: 'response', id: message.id, response: result }, [
              body.buffer,
            ]);
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            (this.options.logger ?? console).error(
              'Weapn resource handler failed:',
              error,
            );
          }
          if (!this.stopped) {
            this.send({
              type: 'response',
              id: message.id,
              response: {
                status: controller.signal.aborted ? 504 : 500,
                statusText: controller.signal.aborted
                  ? 'Gateway Timeout'
                  : 'Internal Server Error',
                headers: [],
                body: new Uint8Array(),
              },
            });
          }
        } finally {
          if (this.options.startupTiming) {
            (this.options.logger ?? console).info(
              `[Weapn timing] Resource ${message.method} ${message.url}: ${
                (performance.now() - requestStartedAt).toFixed(1)
              } ms`,
            );
          }
          clearTimeout(timer);
          this.activeRequests.delete(message.id);
        }
      }
    }
  }
  private finish(error = new Error('Window closed.')): void {
    if (this.stopped) {
      return;
    }
    this.stopped = true;
    this.abort.abort(error);
    for (const controller of this.activeRequests.values()) {
      controller.abort(error);
    }
    this.activeRequests.clear();
    this.ready?.reject(error);
    this.ready = undefined;
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
    this.worker?.terminate();
    this.worker = undefined;
    this.resolveClosed();
  }
}
