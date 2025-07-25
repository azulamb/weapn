import { WeapnApp } from '@azulamb/weapn';

const app = new WeapnApp(import.meta, { logger: console });
app.setUserDataFolder();

await app.init({
  includePath: true,
  debugMode: true,
});
app.developerToolsEnabled = true;

app.webview2.Navigate('https://www.google.co.jp/');

app.run();
