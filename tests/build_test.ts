import { build } from '../build.mod.ts';
import { join } from '@std/path';

// Read RT_GROUP_ICON and RT_ICON from a compiled Windows PE, since Deno re-encodes ICO images.
function executableIcon(
  bytes: Uint8Array,
): { dimensions: number[][]; image: Uint8Array } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const nt = view.getUint32(0x3c, true);
  const optional = nt + 24;
  const sections = optional + view.getUint16(nt + 20, true);
  const address = (rva: number): number => {
    for (let i = 0; i < view.getUint16(nt + 6, true); ++i) {
      const section = sections + i * 40;
      const start = view.getUint32(section + 12, true);
      const size = Math.max(
        view.getUint32(section + 8, true),
        view.getUint32(section + 16, true),
      );
      if (rva >= start && rva < start + size) {
        return view.getUint32(section + 20, true) + rva - start;
      }
    }
    throw new Error('Resource RVA is outside the PE sections');
  };
  const directories = optional +
    (view.getUint16(optional, true) === 0x20b ? 112 : 96);
  const root = address(view.getUint32(directories + 16, true));
  const resource = (type: number): Uint8Array | undefined => {
    const count = view.getUint16(root + 12, true) +
      view.getUint16(root + 14, true);
    for (let i = 0; i < count; ++i) {
      const entry = root + 16 + i * 8;
      if (view.getUint32(entry, true) !== type) continue;
      let offset = view.getUint32(entry + 4, true);
      while (offset & 0x80000000) {
        const directory = root + (offset & 0x7fffffff);
        offset = view.getUint32(directory + 20, true);
      }
      const data = root + offset;
      const start = address(view.getUint32(data, true));
      return bytes.subarray(start, start + view.getUint32(data + 4, true));
    }
    return undefined;
  };
  const group = resource(14);
  if (!group) return { dimensions: [], image: new Uint8Array() };
  const header = new DataView(group.buffer, group.byteOffset, group.byteLength);
  return {
    dimensions: Array.from(
      { length: header.getUint16(4, true) },
      (_, index) => [group[6 + index * 14], group[7 + index * 14]],
    ),
    image: resource(3) ?? new Uint8Array(),
  };
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
      const bundled = await Deno.readFile(
        new URL('../res/icon.ico', import.meta.url),
      );
      const defaultIcon = firstIconImage(bundled);
      const embedded = executableIcon(await Deno.readFile(executable));
      if (!embedded.dimensions.length || !embedded.image.length) {
        throw new Error('Missing default icon');
      }
      // Create a custom single-image ICO from the bundled multi-image icon.
      const custom = new Uint8Array(22 + defaultIcon.length);
      custom.set(bundled.subarray(0, 22));
      custom.set(defaultIcon, 22);
      const header = new DataView(custom.buffer);
      header.setUint16(4, 1, true);
      header.setUint32(18, 22, true);
      const customPath = join(directory, 'custom.ico');
      await Deno.writeFile(customPath, custom);
      const sameImage = (a: Uint8Array, b: Uint8Array) =>
        a.length === b.length && a.every((byte, index) => b[index] === byte);
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
        const actual = executableIcon(await Deno.readFile(output));
        if (icon === null) {
          if (actual.dimensions.length || actual.image.length) {
            throw new Error('null embedded an icon');
          }
        } else if (
          !actual.image.length || sameImage(actual.image, embedded.image)
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
