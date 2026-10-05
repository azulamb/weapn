import { winApi } from '@azulamb/winapi';
import { WeapnApp } from '../app.mod.ts';
import { fromFileUrl } from '@std/path';
import { copy, DLL_VERSION } from '@azulamb/webview2/copy';
import { WindowSizing } from '../src/support/window_sizing.ts';
const testDLL = new URL('../.weapn-data/test-webview2.dll', import.meta.url);

Deno.test({
  name:
    'native client sizing handles partial dimensions and restores thread DPI awareness',
  ignore: Deno.build.os !== 'windows' ||
    Deno.env.get('WEAPN_NATIVE_TEST') !== '1',
  fn() {
    const user = winApi.user.libs;
    const previous = user.symbols.GetThreadDpiAwarenessContext();
    const sizing = new WindowSizing();
    let handle: Deno.PointerValue = null;
    let restored = false;
    try {
      handle = user.symbols.CreateWindowExW(
        0,
        winApi.create.stringPointer('STATIC'),
        null,
        0x00cf0000,
        0,
        0,
        400,
        300,
        null,
        null,
        null,
        null,
      );
      if (!handle) throw new Error('Test window creation failed');
      const dpi = user.symbols.GetDpiForWindow(handle);
      const client = new Int32Array(4);
      const expectClient = (width: number, height: number) => {
        if (
          !user.symbols.GetClientRect(handle, Deno.UnsafePointer.of(client))
        ) {
          throw new Error('GetClientRect failed');
        }
        if (
          client[2] !== Math.round(width * dpi / 96) ||
          client[3] !== Math.round(height * dpi / 96)
        ) throw new Error(`Unexpected client rectangle: ${client}`);
      };
      sizing.resizeClient(handle, 0x00cf0000, 0, 240, 160);
      expectClient(240, 160);
      const outer = new Int32Array(4);
      if (
        !user.symbols.GetWindowRect(handle, Deno.UnsafePointer.of(outer)) ||
        outer[2] - outer[0] <= client[2] || outer[3] - outer[1] <= client[3]
      ) throw new Error('Window borders were not included');
      sizing.resizeClient(handle, 0x00cf0000, 0, 320);
      expectClient(320, 160);
      sizing.resizeClient(handle, 0x00cf0000, 0, undefined, 200);
      expectClient(320, 200);
      sizing.resizeClient(handle, 0x00cf0000, 0);
      expectClient(320, 200);
    } finally {
      if (handle) user.symbols.DestroyWindow(handle);
      sizing.close();
      sizing.close();
      restored = user.symbols.AreDpiAwarenessContextsEqual(
        previous,
        user.symbols.GetThreadDpiAwarenessContext(),
      ) !== 0;
    }
    if (!restored) throw new Error('Thread DPI awareness was not restored');
  },
});
let preparedDLL: Promise<void> | undefined;
async function dllPath(): Promise<string> {
  const path = fromFileUrl(testDLL);
  await (preparedDLL ??= copy(path, { expectedVersion: DLL_VERSION }));
  return path;
}

// Opt-in integration check: creates a real window and closes it automatically.
Deno.test({
  name:
    'native UI Worker serves embedded-style assets and handles frontend commands',
  ignore: Deno.env.get('WEAPN_NATIVE_TEST') !== '1',
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const app = new WeapnApp(import.meta, {
      dllPath: await dllPath(),
      userDataFolder: fromFileUrl(
        new URL('../.weapn-data/smoke-profile/', import.meta.url),
      ),
      startupTimeoutMs: 15_000,
      backgroundColor: '#123456',
      width: 240,
      height: 160,
    });
    let loaded!: () => void, failed!: (error: Error) => void;
    const rendered = new Promise<void>((resolve, reject) => {
      loaded = resolve;
      failed = reject;
    });
    app.onResourceRequest(async () => {
      await new Promise((resolve) => {
        return setTimeout(resolve, 10);
      });
      return new Response(
        await Deno.readTextFile(
          new URL('../sample/docs/index.html', import.meta.url),
        ) +
          '<script>chrome.webview.postMessage({type:"loaded",width:innerWidth,height:innerHeight,dpi:devicePixelRatio})</script>',
        { headers: { 'Content-Type': 'text/html' } },
      );
    });
    app.onMessage(async ({ data }) => {
      if (
        data && typeof data === 'object' && 'type' in data &&
        data.type === 'loaded'
      ) {
        if (
          !('width' in data) || !('height' in data) || data.width !== 240 ||
          data.height !== 160
        ) {
          failed(
            new Error(
              `Expected a 240x160 content viewport, got ${
                JSON.stringify(data)
              }`,
            ),
          );
          return;
        }
        await app.window.setTitle('main callback works');
        await app.window.maximize();
        await app.window.restore();
        loaded();
      }
    });
    await app.start();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await app.setUrl('https://app.example/');
      await Promise.race([
        rendered,
        new Promise((_, reject) => {
          timer = setTimeout(
            () => {
              return reject(new Error('Frontend did not render.'));
            },
            10_000,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
      await app.window.close();
      await app.closed;
    }
  },
});

Deno.test({
  name:
    'native UI Worker serves a physical directory through virtual host mapping',
  ignore: Deno.env.get('WEAPN_NATIVE_TEST') !== '1',
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const app = new WeapnApp(import.meta, {
      dllPath: await dllPath(),
      userDataFolder: fromFileUrl(
        new URL('../.weapn-data/mapping-test/', import.meta.url),
      ),
    });
    app.setVirtualHostNameToFolderMapping(
      'app.example',
      new URL('./fixtures/', import.meta.url),
    );
    let loaded!: () => void;
    const rendered = new Promise<void>((resolve) => {
      loaded = resolve;
    });
    app.onMessage(async ({ data }) => {
      if (
        data && typeof data === 'object' && 'type' in data &&
        data.type === 'loaded'
      ) {
        await app.window.maximize();
        await app.window.restore();
        loaded();
      }
    });
    await app.start();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await app.setUrl('https://app.example/index.html');
      await Promise.race([
        rendered,
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('Mapped frontend did not render.')),
            10_000,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
      await app.window.close();
      await app.closed;
    }
  },
});
