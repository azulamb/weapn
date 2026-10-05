/**
 * Compile a Windows executable with its internal UI Worker and frontend assets,
 * then copy the matching WebView2 DLL beside it.
 * @module
 */
import {
  dirname,
  fromFileUrl,
  isAbsolute,
  join,
  resolve,
  toFileUrl,
} from '@std/path';
import { copy, DLL_VERSION } from '@azulamb/webview2/copy';

/** Inputs and compiler options for {@link build}. Paths are relative to the working directory. */
export interface BuildOptions {
  /** Application entry file passed to deno compile. */
  entry: string;
  /** Executable output path; an .exe extension is added when omitted. */
  output: string;
  /** Files or directories embedded with --include, such as ['./docs/']. */
  assets?: string[];
  /** Additional Worker entrypoints: JSR/HTTP/file URLs or local paths starting with './'. Resolve bare specifiers with import.meta.resolve in your build script. */
  workers?: (string | URL)[];
  /** Omit to use the package's res/icon.ico; null omits --icon. A path uses a custom icon. */
  icon?: string | null;
  /** Additional deno compile arguments, such as ['--allow-net']. FFI, read and env are enabled by default. */
  permissions?: string[];
  /** Keep the executable's console window. Defaults to false. */
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
  for (const asset of options.assets ?? []) {
    args.push('--include', resolve(asset));
  }
  args.push(...options.permissions ?? [], '--output', output, entry);
  let temporaryIcon: string | undefined;
  let result: Deno.CommandOutput;
  try {
    if (options.icon !== null) {
      let icon: string;
      if (options.icon !== undefined) {
        icon = resolve(options.icon);
      } else {
        const source = new URL('./res/icon.ico', import.meta.url);
        if (source.protocol === 'file:') {
          icon = fromFileUrl(source);
        } else {
          const response = await fetch(source);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch default icon: ${response.status} ${source}`,
            );
          }
          const bytes = new Uint8Array(await response.arrayBuffer());
          temporaryIcon = await Deno.makeTempFile({
            prefix: 'weapn-icon-',
            suffix: '.ico',
          });
          await Deno.writeFile(temporaryIcon, bytes);
          icon = temporaryIcon;
        }
      }
      args.splice(1, 0, '--icon', icon);
    }
    result = await new Deno.Command(Deno.execPath(), {
      args,
      stdout: 'inherit',
      stderr: 'inherit',
    }).output();
  } finally {
    if (temporaryIcon !== undefined) await Deno.remove(temporaryIcon);
  }
  if (!result.success) {
    throw new Error(`deno compile failed (${result.code}).`);
  }
  await copy(join(dirname(output), 'webview2.dll'), {
    expectedVersion: DLL_VERSION,
  });
}
