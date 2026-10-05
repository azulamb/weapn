import { WeapnApp } from '../app.mod.ts';
import { WindowSizing } from '../src/support/window_sizing.ts';
import { copy, DLL_VERSION } from '@azulamb/webview2/copy';
import { fromFileUrl } from '@std/path';
import { winApi } from '@azulamb/winapi';

// Requires an interactive desktop: reads only pixels covered by the two test windows.
Deno.test({
  name:
    'transparent canvas composites with the underlying window without fading opaque pixels',
  ignore: Deno.build.os !== 'windows' ||
    Deno.env.get('WEAPN_TRANSPARENCY_TEST') !== '1',
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const user = winApi.user.libs;
    const gdi = winApi.gdi;
    const dwm = winApi.dwm;
    const sizing = new WindowSizing();
    const topmost = Deno.UnsafePointer.create(BigInt.asUintN(64, -1n));
    const backdrop = user.symbols.CreateWindowExW(
      8,
      winApi.create.stringPointer('STATIC'),
      null,
      0x90000000,
      0,
      0,
      640,
      480,
      null,
      null,
      null,
      null,
    );
    let app: WeapnApp | undefined;
    let started = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!backdrop) throw new Error('Backdrop creation failed');
      const brush = gdi.CreateSolidBrush(32 | (96 << 8) | (160 << 16));
      const dc = user.symbols.GetDC(backdrop);
      try {
        if (
          !brush || !dc ||
          !user.symbols.FillRect(
            dc,
            Deno.UnsafePointer.of(new Int32Array([0, 0, 640, 480])),
            brush,
          )
        ) throw new Error('Backdrop painting failed');
      } finally {
        if (dc) user.symbols.ReleaseDC(backdrop, dc);
        if (brush) gdi.DeleteObject(brush);
      }
      const dll = fromFileUrl(
        new URL('../.weapn-data/transparency-webview2.dll', import.meta.url),
      );
      await copy(dll, { expectedVersion: DLL_VERSION });
      const title = `Transparent-test-${crypto.randomUUID()}`;
      app = new WeapnApp(import.meta, {
        title,
        dllPath: dll,
        width: 240,
        height: 160,
        transparent: true,
        decorations: false,
        // Transparency must take precedence over an opaque initial color.
        backgroundColor: '#00ff00',
        userDataFolder: fromFileUrl(
          new URL('../.weapn-data/transparency-profile/', import.meta.url),
        ),
      });
      let ready!: () => void;
      const rendered = new Promise<void>((resolve) => {
        ready = resolve;
      });
      app.onResourceRequest(() =>
        new Response(
          `<!doctype html>
<style>html,body { margin:0; background:transparent; overflow:hidden } canvas {display:block}</style>
<canvas width="240" height="160"></canvas><script>
const ctx = document.querySelector('canvas').getContext('2d');
ctx.fillStyle = 'rgb(240,80,40)'; ctx.fillRect(40,40,40,40);
ctx.fillStyle = 'rgba(240,80,40,0.5)'; ctx.fillRect(100,40,40,40);
requestAnimationFrame(() => requestAnimationFrame(() => chrome.webview.postMessage('ready')));
</script>`,
          { headers: { 'Content-Type': 'text/html' } },
        )
      );
      app.onMessage(({ data }) => {
        if (data === 'ready') ready();
      });
      await app.start();
      started = true;
      await app.setUrl('https://app.example/');
      await Promise.race([
        rendered,
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('Transparent page timeout')),
            10000,
          );
        }),
      ]);
      const name = new Uint16Array(title.length + 1);
      for (let i = 0; i < title.length; ++i) name[i] = title.charCodeAt(i);
      const handle = user.symbols.FindWindowW(
        null,
        Deno.UnsafePointer.of(name),
      );
      if (
        !handle || !user.symbols.SetWindowPos(handle, topmost, 0, 0, 0, 0, 0x51)
      ) throw new Error('Cannot position the transparent test window'); // NOSIZE | NOACTIVATE | SHOWWINDOW
      const scale = user.symbols.GetDpiForWindow(handle) / 96;
      let colors: number[] = [];
      const expected = [
        32 | (96 << 8) | (160 << 16),
        240 | (80 << 8) | (40 << 16),
        136 | (88 << 8) | (100 << 16),
      ];
      const matches = () =>
        colors.every((color, index) =>
          [0, 8, 16].every((shift) =>
            Math.abs(
              ((color >>> shift) & 255) - ((expected[index] >>> shift) & 255),
            ) <= 3
          )
        );
      for (let attempt = 0; attempt < 40; ++attempt) {
        dwm.DwmFlush();
        const screen = user.symbols.GetDC(null);
        try {
          if (!screen) throw new Error('Cannot read test window pixels');
          colors = [[10, 10], [60, 60], [120, 60]].map(([x, y]) =>
            gdi.GetPixel(
              screen,
              Math.round(x * scale),
              Math.round(y * scale),
            )
          );
        } finally {
          if (screen) user.symbols.ReleaseDC(null, screen);
        }
        if (matches()) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      throw new Error(
        `Composited pixels ${colors.map((v) => v.toString(16))}, expected ${
          expected.map((v) => v.toString(16))
        }`,
      );
    } finally {
      clearTimeout(timer);
      if (app && started) {
        await app.window.close();
        await app.closed;
      }
      if (backdrop) user.symbols.DestroyWindow(backdrop);
      sizing.close();
    }
  },
});
