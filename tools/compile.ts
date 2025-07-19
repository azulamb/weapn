import { compile } from '@azulamb/webview2/compile';

const result = await compile(
  'sample/main.ts',
  './sample/main.exe',
  [
    '--allow-read',
    '--allow-env',
    '--allow-net',
  ],
  {
    icon: './sample/icon.ico',
    dllPath: './sample/webview2.dll',
    includes: [],
  },
);

console.log(result.command.join(' '));
console.log(result.stdout);

if (result.stderr) {
  console.error(result.stderr);
  Deno.exit(1);
}
