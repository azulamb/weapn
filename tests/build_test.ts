import { build } from '../build.mod.ts';
import { join } from '@std/path';

Deno.test({
  name: 'build embeds remote Workers without generated application bootstraps',
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
