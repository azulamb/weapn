import { WeapnApp } from '@azulamb/weapn';

const app = new WeapnApp(import.meta, { logger: console });
app.setUserDataFolder();
app.setWeapnMessage();

await app.init({
  includePath: true,
  debugMode: true,
});
app.developerToolsEnabled = true;

app.webview2.core.addWebResourceRequestedFilter('http://app.local/*', 0);
app.addWebResourceRequested(
  import.meta.resolve('./worker.ts'),
);

app.setUrl('http://app.local/');

app.run();
