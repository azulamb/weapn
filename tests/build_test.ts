import { build } from '../build.mod.ts';
import { join } from '@std/path';

function contains(bytes: Uint8Array, image: Uint8Array): boolean {
  for (
    let offset = bytes.indexOf(image[0]);
    offset >= 0;
    offset = bytes.indexOf(image[0], offset + 1)
  ) {
    if (image.every((byte, index) => bytes[offset + index] === byte)) {
      return true;
    }
  }
  return false;
}

function firstIconImage(bytes: Uint8Array): Uint8Array {
  const header = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const length = header.getUint32(14, true);
  const offset = header.getUint32(18, true);
  return bytes.subarray(offset, offset + length);
}

Deno.test({
  name:
    'build embeds remote Workers and respects default, null and custom icons',
  ignore: Deno.build.os !== 'windows',
  sanitizeResources: false,
  async fn() {
    const directory = await Deno.makeTempDir({ prefix: 'weapn-build-test-' });
    const server = Deno.serve(
      { hostname: '127.0.0.1', port: 0, onListen: () => {} },
      (request) =>
        new Response(
          new URL(request.url).pathname === '/message.js'
            ? 'export const message = "embedded remote Worker: OK";'
            : 'import { message } from "./message.js"; postMessage(message);',
          {
            headers: { 'Content-Type': 'application/javascript' },
          },
        ),
    );
    const remote = `http://127.0.0.1:${server.addr.port}/worker.js`;
    const executable = join(
      directory,
      Deno.build.os === 'windows' ? 'app.exe' : 'app',
    );
    try {
      const entry = join(directory, 'main.ts');
      await Deno.writeTextFile(
        entry,
        `const source: string = ${JSON.stringify(remote)};
const worker = new Worker(source, { type: 'module' });
const timer = setTimeout(() => { console.error('Worker timeout'); Deno.exit(1); }, 10000);
worker.onerror = () => { clearTimeout(timer); Deno.exit(1); };
worker.onmessage = (event) => { console.log(event.data); clearTimeout(timer); worker.terminate(); };
`,
      );
      await build({
        entry,
        output: executable,
        terminal: true,
        workers: [remote, import.meta.resolve('@azulamb/weapn/worker')],
        permissions: [`--allow-import=127.0.0.1:${server.addr.port}`],
      });
      const defaultIcon = firstIconImage(
        await Deno.readFile(new URL('../res/icon.ico', import.meta.url)),
      );
      if (!contains(await Deno.readFile(executable), defaultIcon)) {
        throw new Error('Default icon image was not embedded');
      }
      // Create a custom single-image ICO from the bundled multi-image icon.
      const bundled = await Deno.readFile(
        new URL('../res/icon.ico', import.meta.url),
      );
      const custom = new Uint8Array(22 + defaultIcon.length);
      custom.set(bundled.subarray(0, 22));
      custom.set(defaultIcon, 22);
      const header = new DataView(custom.buffer);
      header.setUint16(4, 1, true);
      header.setUint32(18, 22, true);
      const customPath = join(directory, 'custom.ico');
      await Deno.writeFile(customPath, custom);
      for (const icon of [null, customPath]) {
        const output = join(
          directory,
          icon === null ? 'no-icon.exe' : 'custom-icon.exe',
        );
        await build({
          entry,
          output,
          terminal: true,
          workers: [remote],
          icon,
          permissions: [`--allow-import=127.0.0.1:${server.addr.port}`],
        });
        const bytes = await Deno.readFile(output);
        if (icon === null) {
          if (contains(bytes, defaultIcon)) {
            throw new Error('null embedded the package default icon');
          }
        } else if (
          !contains(bytes, firstIconImage(await Deno.readFile(icon)))
        ) {
          throw new Error('Custom icon image was not embedded');
        }
      }
      await server.shutdown();
      // The HTTP source is now unavailable; the executable must use its embedded module.
      const result = await new Deno.Command(executable, {
        cwd: directory,
        stdout: 'piped',
        stderr: 'piped',
      }).output();
      if (
        !result.success ||
        !new TextDecoder().decode(result.stdout).includes(
          'embedded remote Worker: OK',
        )
      ) throw new Error(new TextDecoder().decode(result.stderr));
      try {
        await Deno.stat(join(directory, '.weapn-build'));
        throw new Error('Unexpected generated bootstraps');
      } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
      }
      if (!(await Deno.stat(join(directory, 'webview2.dll'))).isFile) {
        throw new Error('DLL was not copied');
      }
    } finally {
      await server.shutdown();
      await Deno.remove(directory, { recursive: true });
    }
  },
});
