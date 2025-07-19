import { WeapnApp } from '../mod.ts';

try {
  const stat = Deno.statSync(new URL(import.meta.url));
  console.log(new URL(import.meta.url));
  console.log(stat);
} catch (_error) {
  console.log(null);
}

const app = new WeapnApp(new URL(import.meta.url));
app.setUserDataFolder();

await app.init({
  includePath: true,
  debugMode: true,
});

app.webview2.Navigate('https://www.google.co.jp/');

app.run();
