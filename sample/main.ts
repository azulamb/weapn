import { WeapnApp } from '../mod.ts';

const app = new WeapnApp(import.meta, { logger: console });
app.setUserDataFolder();

await app.init({
  includePath: true,
  debugMode: true,
});

app.webview2.Navigate('https://www.google.co.jp/');

app.run();
