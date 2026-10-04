import { build } from '@azulamb/weapn/build';

await build({
  entry: './main.ts',
  output: './app.exe',
  assets: ['./docs/'],
  workers: ['./worker.ts'],
  permissions: ['--allow-write', '--allow-net'],
});
