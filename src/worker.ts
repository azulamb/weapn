import { ResponseStream } from './libs/stream.ts';
import {
  createWebView2,
  Deferral,
  JStream,
  WebResourceRequestedEventArgs,
  type WebView2,
} from './libs/webview2.ts';

interface WorkerGlobalScope {
  readonly caches: CacheStorage;
  readonly crossOriginIsolated: boolean;
  readonly crypto: Crypto;
  //readonly fonts: FontFaceSet;
  //readonly indexedDB: IDBFactory;
}
interface DedicatedWorkerGlobalScope extends WorkerGlobalScope {
  readonly name: string;
  close(): void;
  //cancelAnimationFrame(handle: number): void;
  //requestAnimationFrame(callback: (time: DOMHighResTimeStamp) => void): number;
  onmessage: (event: MessageEvent) => void;
  // deno-lint-ignore no-explicit-any
  postMessage: (message: any) => void;
  onmessageerror: (event: MessageEvent) => void;
}

declare const self: DedicatedWorkerGlobalScope;

interface WeapnWorkerMessage {
  type: string;
}

export type WeapnWorkerMessages<T = undefined> = {
  type: 'init';
  dll?: string;
  // pointers.
  core: bigint;
  environments: bigint;
  settings: bigint;
  controllers: bigint;
} | {
  type: 'request';
  eventArgs: bigint;
  deferral: bigint;
} | WeapnWorkerMessage & T;

export class WeaponWorker {
  protected prepare: Promise<void>;
  protected webview2!: WebView2;
  constructor() {
    console.log('WeapnWorker:');
    this.prepare = new Promise<void>((resolve, reject) => {
      self.onmessage = (event) => {
        if (!event.data || typeof event.data !== 'object') {
          return;
        }
        const data = event.data as WeapnWorkerMessages;
        console.log(`worker:${data.type}`);
        if (data.type !== 'init') {
          return;
        }
        if (
          typeof data.core !== 'bigint' ||
          typeof data.environments !== 'bigint' ||
          typeof data.settings !== 'bigint' ||
          typeof data.controllers !== 'bigint'
        ) {
          return reject(new Error('Invalid pointers.'));
        }

        this.webview2 = createWebView2(data.dll, {
          core: Deno.UnsafePointer.create(data.core),
          environments: Deno.UnsafePointer.create(data.environments),
          settings: Deno.UnsafePointer.create(data.settings),
          controllers: Deno.UnsafePointer.create(data.controllers),
        });

        self.onmessage = (message) => {
          this.onMessage(message);
        };
        resolve();
      };
    });
  }

  public onrequest?: (args: WebResourceRequestedEventArgs) => Promise<Response>;

  get onPrepared() {
    return this.prepare;
  }

  protected onMessage(event: MessageEvent<WeapnWorkerMessages>) {
    if (!event.data || typeof event.data !== 'object') {
      return;
    }
    switch (event.data.type) {
      case 'init':
        return;
      case 'request':
        return this.onRequest(event.data);
    }
  }

  protected headersToString(headers: Headers): string {
    return [...headers.entries()].map(([key, value]) => {
      return `${key}: ${value}`;
    }).join('\n');
  }

  public onRequest(data: {
    type: 'request';
    eventArgs: bigint;
    deferral: bigint;
  }) {
    if (
      typeof data.eventArgs !== 'bigint' ||
      typeof data.deferral !== 'bigint'
    ) {
      throw new Error('Invalid pointers.');
    }
    const args = new WebResourceRequestedEventArgs(
      this.webview2.lib,
      Deno.UnsafePointer.create(data.eventArgs),
    );
    const deferral = new Deferral(
      this.webview2.lib,
      Deno.UnsafePointer.create(data.deferral),
    );
    if (this.onrequest) {
      this.onrequest(args).then((response) => {
        if (response instanceof Response) {
          return response;
        }
        throw new Error('Response is not instance of Response.');
      }).catch((_error) => {
        return new Response(null, { status: 500 });
      }).then((response) => {
        const content = JStream.create(
          new ResponseStream(this.webview2.lib).setResponse(response),
          //new FileResponseStream(this.webview2.lib).setFile(new URL(this.meta.resolve('./docs/index.html')))
        );

        console.log(`${response.status} ${response.statusText}`);
        const webview2Response = this.webview2.createWebResourceResponse(
          content,
          response.status,
          //'OK',
          response.statusText ? response.statusText : 'Unknown',
          this.headersToString(response.headers),
        );
        args.Response = webview2Response;
      }).finally(() => {
        deferral.complete();
      });
    }
  }
}
