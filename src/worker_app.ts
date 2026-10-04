import { dirname, fromFileUrl, isAbsolute, join, resolve } from '@std/path';
import { copy } from '@azulamb/webview2/copy';
import { isCompiled } from './support/compile.ts';
import type {
  FromUI,
  ResourceResult,
  ToUI,
  UIOptions,
  VirtualHostMapping,
  WindowAction,
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
  resourceFilter?: string;
  resourceTimeoutMs?: number;
  startupTimeoutMs?: number;
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
      return this.command('maximize');
    },
    minimize: (): Promise<void> => {
      return this.command('minimize');
    },
    restore: (): Promise<void> => {
      return this.command('restore');
    },
    setTitle: (title: string): Promise<void> => {
      return this.command('title', title);
    },
    close: (): Promise<void> => {
      return this.command('close');
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
    return this.command('navigate', url);
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
    if (this.started) {
      throw new Error('An application can only be started once.');
    }
    this.started = true;
    const options = this.options;
    const timeout = options.startupTimeoutMs ?? 30_000;
    const resourceTimeout = options.resourceTimeoutMs ?? 30_000;
    if (
      !Number.isFinite(timeout) || timeout <= 0 ||
      !Number.isFinite(resourceTimeout) || resourceTimeout <= 0
    ) {
      this.finish(new Error('Timeouts must be positive finite numbers.'));
      throw new Error('Timeouts must be positive finite numbers.');
    }
    const compiled = isCompiled(new URL(this.meta.url));
    const base = compiled ? dirname(Deno.execPath()) : Deno.cwd();
    const absolute = (path: string) =>
      isAbsolute(path) ? path : join(base, path);
    const dllPath = absolute(options.dllPath ?? 'webview2.dll');
    // Development only: packaged applications receive their DLL from build().
    if (!compiled && options.dllPath === undefined) {
      try {
        try {
          const stat = await Deno.stat(dllPath);
          if (!stat.isFile) throw new Error(`Not a DLL file: ${dllPath}`);
        } catch (error) {
          if (!(error instanceof Deno.errors.NotFound)) throw error;
          await copy(dllPath);
        }
      } catch (error) {
        this.finish(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    }
    const ready = new Promise<void>((resolve, reject) => {
      this.ready = { resolve, reject };
    });
    const timer = setTimeout(
      () => {
        return this.finish(new Error('UI Worker startup timed out.'));
      },
      timeout,
    );
    try {
      this.worker = new Worker(workerURL, { type: 'module' });
      this.worker.onmessage = (event: MessageEvent<FromUI>) => {
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
        resourceFilter: this.resourceHandler
          ? options.resourceFilter ?? 'https://app.local/*'
          : undefined,
        resourceTimeoutMs: resourceTimeout,
        virtualHosts: [...this.virtualHosts.values()],
      };
      this.send({ type: 'init', options: init });
      await ready;
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
  mountAssets(directory: URL, origin = 'https://app.local'): this {
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
        const bytes = await Deno.readFile(file);
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
  private async command(action: WindowAction, value?: string): Promise<void> {
    if (!this.started || this.ready || this.stopped) {
      throw new Error('Call and await start() before window operations.');
    }
    const id = ++this.nextID;
    return await new Promise<void>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try {
        this.send({ type: 'command', id, action, value });
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
          console.error('Weapn event handler failed:', error);
        }
        break;
      case 'request': {
        let response: Response;
        try {
          response = await this.resourceHandler!(
            new Request(message.url, {
              method: message.method,
              signal: this.abort.signal,
            }),
          );
          if (!(response instanceof Response)) {
            throw new Error('Resource handler must return a Response.');
          }
          const body = new Uint8Array(await response.arrayBuffer());
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
          console.error('Weapn resource handler failed:', error);
          if (!this.stopped) {
            this.send({
              type: 'response',
              id: message.id,
              response: {
                status: 500,
                statusText: 'Internal Server Error',
                headers: [],
                body: new Uint8Array(),
              },
            });
          }
        }
      }
    }
  }
  private finish(error = new Error('Window closed.')): void {
    if (this.stopped) {
      return;
    }
    this.stopped = true;
    this.abort.abort();
    this.ready?.reject(error);
    this.ready = undefined;
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
    this.worker?.terminate();
    this.worker = undefined;
    this.resolveClosed();
  }
}
