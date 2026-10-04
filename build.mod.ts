import { dirname, isAbsolute, join, resolve, toFileUrl } from '@std/path';
import { copy } from '@azulamb/webview2/copy';

export interface BuildOptions {
  entry: string;
  output: string;
  assets?: string[];
  /** Additional Worker entrypoints: JSR/HTTP/file URLs or local paths starting with './'. Resolve bare specifiers with import.meta.resolve in your build script. */
  workers?: (string | URL)[];
  icon?: string;
  permissions?: string[];
  terminal?: boolean;
}

function workerSpecifier(worker: string | URL): string {
  if (worker instanceof URL) return worker.href;
  if (isAbsolute(worker) || worker.startsWith('.')) {
    return toFileUrl(resolve(worker)).href;
  }
  if (/^(?:jsr|https?|file):/.test(worker)) return worker;
  throw new TypeError(
    'Resolve Worker dependency names with import.meta.resolve() in your build script, or use a URL or a local path starting with ./',
  );
}

/** Builds the app and internal UI Worker, then places the matching DLL beside the exe. */
export async function build(options: BuildOptions): Promise<void> {
  const entry = resolve(options.entry);
  const output = resolve(
    options.output.endsWith('.exe') ? options.output : options.output + '.exe',
  );
  await Deno.mkdir(dirname(output), { recursive: true });
  const workers = new Set([
    import.meta.resolve('./src/ui_worker_entry.ts'),
    ...(options.workers ?? []).map(workerSpecifier),
  ]);
  const args = [
    'compile',
    '--allow-ffi',
    '--allow-read',
    '--allow-env',
  ];
  for (const worker of workers) args.push('--include', worker);
  if (!options.terminal) {
    args.push('--no-terminal');
  }
  if (options.icon) {
    args.push('--icon', resolve(options.icon));
  }
  for (const asset of options.assets ?? []) {
    args.push('--include', resolve(asset));
  }
  args.push(...options.permissions ?? [], '--output', output, entry);
  const result = await new Deno.Command(Deno.execPath(), {
    args,
    stdout: 'inherit',
    stderr: 'inherit',
  }).output();
  if (!result.success) {
    throw new Error(`deno compile failed (${result.code}).`);
  }
  await copy(join(dirname(output), 'webview2.dll'));
}
