import { WeapnApp } from '@azulamb/weapn';

const app = new WeapnApp(import.meta, { logger: console });
app.setUserDataFolder();
app.setWeapnMessage();

await app.init({
  includePath: true,
  debugMode: true,
});
app.developerToolsEnabled = true;

//app.webview2.Navigate('https://www.google.co.jp/');
app.webview2.Navigate(import.meta.resolve('./docs/index.html'));

app.run();
