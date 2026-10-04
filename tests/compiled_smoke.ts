import { WeapnApp } from '../app.mod.ts';

// Compile with tests/fixtures/ and place only exe + DLL in a new folder.
const app = new WeapnApp(import.meta);
app.mountAssets(new URL('./fixtures/', import.meta.url));
app.onMessage(async ({ data }) => {
  if (
    data && typeof data === 'object' && 'type' in data && data.type === 'loaded'
  ) {
    await app.window.setTitle('Embedded assets loaded');
    await app.window.maximize();
    await app.window.restore();
    clearTimeout(timer);
    console.log('Compiled UI Worker and embedded assets: OK');
    await app.window.close();
  }
});
await app.start();
const timer = setTimeout(() => {
  console.error('Compiled asset rendering timed out');
  Deno.exit(1);
}, 15_000);
await app.setUrl('https://app.example/');
await app.closed;
clearTimeout(timer);
