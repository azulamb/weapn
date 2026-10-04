import { WeapnApp } from '../app.mod.ts';
import { join } from '@std/path';
import type { FromUI, ToUI } from '../src/ui_protocol.ts';

function assert(value: unknown, message = 'Assertion failed'): asserts value {
  if (!value) {
    throw new Error(message);
  }
}
class FakeWorker {
  static last: FakeWorker;
  static autoReady = true;
  onmessage?: (event: MessageEvent<FromUI>) => void;
  onerror?: (event: ErrorEvent) => void;
  onmessageerror?: () => void;
  sent: ToUI[] = [];
  terminated = false;
  constructor() {
    FakeWorker.last = this;
  }
  postMessage(message: ToUI) {
    this.sent.push(message);
    if (message.type === 'init' && FakeWorker.autoReady) {
      queueMicrotask(() => {
        return this.emit({ type: 'ready' });
      });
    }
    if (message.type === 'command') {
      queueMicrotask(() => {
        this.emit({ type: 'result', id: message.id });
        if (message.action === 'close') {
          this.emit({ type: 'closed' });
        }
      });
    }
  }
  emit(message: FromUI) {
    this.onmessage?.({ data: message } as MessageEvent<FromUI>);
  }
  terminate() {
    this.terminated = true;
  }
}
Deno.test('initial background validates and is forwarded to the UI Worker', () =>
  withWorker(async () => {
    const invalid = new WeapnApp(import.meta, {
      dllPath: './test.dll',
      backgroundColor: '#12345G',
    });
    await rejected(invalid.start());
    const app = new WeapnApp(import.meta, {
      dllPath: './test.dll',
      backgroundColor: '#123456',
    });
    await app.start();
    const init = FakeWorker.last.sent.find((message) =>
      message.type === 'init'
    );
    assert(init?.type === 'init' && init.options.backgroundColor === '#123456');
    await app.window.close();
  }));
async function withWorker(test: () => Promise<void>) {
  const original = globalThis.Worker;
  globalThis.Worker = FakeWorker as unknown as typeof Worker;
  try {
    await test();
  } finally {
    globalThis.Worker = original;
    FakeWorker.autoReady = true;
  }
}
async function rejected(promise: Promise<unknown>) {
  try {
    await promise;
  } catch {
    return;
  }
  throw new Error('Expected rejection');
}
async function responseFrom(worker: FakeWorker, id: number) {
  for (let count = 0; count < 100; count++) {
    const message = worker.sent.find((item) =>
      item.type === 'response' && item.id === id
    );
    if (message?.type === 'response') {
      return message.response;
    }
    await new Promise((resolve) => {
      return setTimeout(resolve, 1);
    });
  }
  throw new Error('No resource response');
}

Deno.test('resource cancellation aborts its Request and releases the concurrency slot', () =>
  withWorker(async () => {
    let request!: Request;
    const app = new WeapnApp(import.meta, {
      dllPath: './test.dll',
      maxConcurrentRequests: 1,
    });
    app.onResourceRequest((value) => {
      request = value;
      return new Promise<Response>(() => {});
    });
    await app.start();
    const worker = FakeWorker.last;
    worker.emit({
      type: 'request',
      id: 1,
      url: 'https://app.example/',
      method: 'GET',
    });
    worker.emit({
      type: 'request',
      id: 2,
      url: 'https://app.example/',
      method: 'GET',
    });
    assert((await responseFrom(worker, 2)).status === 503);
    worker.emit({ type: 'cancel', id: 1 });
    assert((await responseFrom(worker, 1)).status === 504);
    assert(request.signal.aborted);
    await app.window.close();
  }));

Deno.test('startup timeout includes stalled DLL preparation', () =>
  withWorker(async () => {
    const originalCopy = Deno.copyFile;
    const originalFetch = globalThis.fetch;
    const previous = Deno.cwd();
    const directory = await Deno.makeTempDir();
    let release!: () => void;
    Deno.copyFile = () =>
      new Promise<void>((resolve) => {
        release = resolve;
      });
    globalThis.fetch = (_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        if (signal?.aborted) reject(signal.reason);
        else {signal?.addEventListener('abort', () => reject(signal.reason), {
            once: true,
          });}
      });
    try {
      Deno.chdir(directory);
      const app = new WeapnApp(import.meta, { startupTimeoutMs: 20 });
      await rejected(app.start());
      await app.closed;
    } finally {
      release?.();
      Deno.copyFile = originalCopy;
      globalThis.fetch = originalFetch;
      Deno.chdir(previous);
      await new Promise((resolve) => setTimeout(resolve, 20));
      await Deno.remove(directory, { recursive: true });
    }
  }));

Deno.test('development startup copies a missing DLL and preserves an existing DLL', () =>
  withWorker(async () => {
    const previous = Deno.cwd();
    const directory = await Deno.makeTempDir({ prefix: 'weapn-dll-test-' });
    try {
      Deno.chdir(directory);
      const app = new WeapnApp(import.meta);
      await app.start();
      const bytes = await Deno.readFile('./webview2.dll');
      assert(bytes.length > 2 && bytes[0] === 0x4D && bytes[1] === 0x5A);
      const init = FakeWorker.last.sent.find((message) =>
        message.type === 'init'
      );
      assert(
        init?.type === 'init' &&
          init.options.dllPath === join(directory, 'webview2.dll'),
      );
      await app.window.close();

      await Deno.writeTextFile('./webview2.dll', 'existing DLL');
      const second = new WeapnApp(import.meta);
      await second.start();
      assert(await Deno.readTextFile('./webview2.dll') === 'existing DLL');
      await second.window.close();
    } finally {
      Deno.chdir(previous);
      await Deno.remove(directory, { recursive: true });
    }
  }));

Deno.test('commands and frontend events route through main without native imports', () =>
  withWorker(async () => {
    const app = new WeapnApp(import.meta, { dllPath: './test.dll' });
    await rejected(app.window.maximize());
    app.onMessage(async ({ data }) => {
      if (data === 'maximize') await app.window.maximize();
    });
    await app.start();
    const worker = FakeWorker.last;
    worker.emit({
      type: 'message',
      source: 'https://app.example/',
      data: 'maximize',
    });
    await app.window.setTitle('main');
    assert(
      worker.sent.some((message) =>
        message.type === 'command' && message.action === 'maximize'
      ),
    );
    await app.window.close();
    await app.closed;
    assert(worker.terminated);
    await rejected(app.setUrl('https://app.example/'));
  }));

Deno.test('virtual hosts are registered in the UI Worker without resource interception', () =>
  withWorker(async () => {
    const app = new WeapnApp(import.meta, { dllPath: './test.dll' });
    const folder = new URL('./fixtures/', import.meta.url);
    app.setVirtualHostNameToFolderMapping('app.example', folder);
    await app.start();
    const init = FakeWorker.last.sent.find((message) =>
      message.type === 'init'
    );
    assert(init?.type === 'init');
    assert(init.options.virtualHosts?.[0].hostName === 'app.example');
    assert(init.options.virtualHosts?.[0].accessKind === 'denyCors');
    assert(init.options.resourceFilter === undefined);
    let rejectedLateRegistration = false;
    try {
      app.setVirtualHostNameToFolderMapping('late.local', folder);
    } catch {
      rejectedLateRegistration = true;
    }
    assert(rejectedLateRegistration);
    await app.window.close();
  }));

Deno.test('async resource handler can issue window commands while response is pending', () =>
  withWorker(async () => {
    const app = new WeapnApp(import.meta, { dllPath: './test.dll' });
    app.onResourceRequest(async () => {
      await app.window.setTitle('serving');
      await new Promise((resolve) => {
        return setTimeout(resolve, 5);
      });
      return new Response(new Uint8Array([0, 255, 10]), {
        headers: { 'Content-Type': 'application/octet-stream' },
      });
    });
    await app.start();
    const worker = FakeWorker.last;
    worker.emit({
      type: 'request',
      id: 7,
      url: 'https://app.example/file',
      method: 'GET',
    });
    const response = await responseFrom(worker, 7);
    assert(response.status === 200 && response.body.join(',') === '0,255,10');
    assert(
      response.headers.some(([key, value]) =>
        key === 'content-type' && value === 'application/octet-stream'
      ),
    );
    await app.window.close();
  }));

Deno.test('handler failures become 500 responses', () =>
  withWorker(async () => {
    const app = new WeapnApp(import.meta, { dllPath: './test.dll' });
    app.onResourceRequest(() => {
      throw new Error('test failure');
    });
    await app.start();
    const worker = FakeWorker.last;
    worker.emit({
      type: 'request',
      id: 8,
      url: 'https://app.example/',
      method: 'GET',
    });
    assert((await responseFrom(worker, 8)).status === 500);
    await app.window.close();
  }));

Deno.test('asset routing supports index, MIME, HEAD, encoded names and rejects traversal', () =>
  withWorker(async () => {
    const root = await Deno.makeTempDir();
    try {
      await Deno.writeTextFile(root + '/index.html', '<h1>embedded</h1>');
      await Deno.writeTextFile(root + '/a #.js', 'test');
      const app = new WeapnApp(import.meta, { dllPath: './test.dll' });
      const url = new URL('file:///');
      url.pathname = root.replaceAll('\\', '/') + '/';
      app.mountAssets(url);
      await app.start();
      const worker = FakeWorker.last;
      const cases = [
        ['/', 'GET', 200],
        ['/a%20%23.js', 'GET', 200],
        ['/missing', 'GET', 404],
        ['/%2e%2e%5coutside', 'GET', 403],
        ['/', 'HEAD', 200],
      ] as const;
      for (let id = 0; id < cases.length; id++) {
        const [path, method, status] = cases[id];
        worker.emit({
          type: 'request',
          id: id + 1,
          url: 'https://app.example' + path,
          method,
        });
        const response = await responseFrom(worker, id + 1);
        assert(response.status === status, `${path}: ${response.status}`);
        if (method === 'HEAD') assert(response.body.length === 0);
        if (path === '/') {
          assert(
            response.headers.some(([key, value]) =>
              key === 'content-type' && value.startsWith('text/html')
            ),
          );
        }
      }
      await app.window.close();
    } finally {
      await Deno.remove(root, { recursive: true });
    }
  }));

Deno.test('startup timeout terminates worker and resolves closed', () =>
  withWorker(async () => {
    FakeWorker.autoReady = false;
    const app = new WeapnApp(import.meta, {
      startupTimeoutMs: 5,
      dllPath: './test.dll',
    });
    await rejected(app.start());
    await app.closed;
    assert(FakeWorker.last.terminated);
  }));

Deno.test('worker failure rejects outstanding native commands', () =>
  withWorker(async () => {
    const app = new WeapnApp(import.meta, { dllPath: './test.dll' });
    await app.start();
    const worker = FakeWorker.last;
    worker.postMessage = (message) => {
      worker.sent.push(message);
    };
    const command = app.window.maximize();
    worker.emit({ type: 'fatal', error: 'native failure' });
    await rejected(command);
    await app.closed;
    assert(worker.terminated);
  }));
