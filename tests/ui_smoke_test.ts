import { WeapnApp } from '../app.mod.ts';
import { fromFileUrl } from '@std/path';

// Opt-in integration check: creates a real window and closes it automatically.
Deno.test({
  name:
    'native UI Worker serves embedded-style assets and handles frontend commands',
  ignore: Deno.env.get('WEAPN_NATIVE_TEST') !== '1',
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const app = new WeapnApp(import.meta, {
      dllPath: fromFileUrl(
        new URL(
          '../../deno_windows_webview2/webview2/x64/Release/webview2.dll',
          import.meta.url,
        ),
      ),
      userDataFolder: fromFileUrl(
        new URL('../.weapn-build/smoke-profile/', import.meta.url),
      ),
      startupTimeoutMs: 15_000,
    });
    let loaded!: () => void;
    const rendered = new Promise<void>((resolve) => {
      loaded = resolve;
    });
    app.onResourceRequest(async () => {
      await new Promise((resolve) => {
        return setTimeout(resolve, 10);
      });
      return new Response(
        await Deno.readTextFile(
          new URL('../sample/docs/index.html', import.meta.url),
        ) +
          '<script>chrome.webview.postMessage({type:"loaded"})</script>',
        { headers: { 'Content-Type': 'text/html' } },
      );
    });
    app.onMessage(async ({ data }) => {
      if (
        data && typeof data === 'object' && 'type' in data &&
        data.type === 'loaded'
      ) {
        await app.window.setTitle('main callback works');
        await app.window.maximize();
        await app.window.restore();
        loaded();
      }
    });
    await app.start();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await app.setUrl('https://app.local/');
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
      dllPath: fromFileUrl(
        new URL(
          '../../deno_windows_webview2/webview2/x64/Release/webview2.dll',
          import.meta.url,
        ),
      ),
      userDataFolder: fromFileUrl(
        new URL('../.weapn-data/mapping-test/', import.meta.url),
      ),
    });
    app.setVirtualHostNameToFolderMapping(
      'app.local',
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
      await app.setUrl('https://app.local/index.html');
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
