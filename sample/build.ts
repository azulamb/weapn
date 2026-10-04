import { build } from '@azulamb/weapn/build';

await build({
  entry: './main.ts',
  output: './app.exe',
  assets: ['./docs/'],
});
