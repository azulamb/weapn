import { compile } from '@azulamb/webview2/compile';

const result = await compile([
  '--allow-read',
  '--allow-env',
  '--allow-net',
  '--no-terminal',
  '--icon',
  './sample/icon.ico',
  '--output',
  './sample/main.exe',
  'sample/main.ts',
], {
  dllPath: './sample/webview2.dll',
});

console.log(result.command.join(' '));
console.log(result.stdout);

if (result.stderr) {
  console.error(result.stderr);
  Deno.exit(1);
}
