// Sample2
// This sample is use SetVirtualHostNameToFolderMapping.
// docs/ folder is used as a virtual host.
// Exec: deno task start:2

import { WeapnApp } from '@azulamb/weapn';

const app = new WeapnApp(import.meta, { logger: console });
app.setUserDataFolder();
app.setWeapnMessage();

await app.init({
  includePath: true,
  debugMode: true,
});
app.developerToolsEnabled = true;

app.webview2.core.setVirtualHostNameToFolderMapping(
  'app.local',
  // Target is PROJECT_DIR/docs/
  // Source file is PROJECT_DIR/sample2/main.ts, but start in PROJECT_DIR/
  app.getAppFolder('./docs/', Deno.cwd()),
  // If target is PROJECT_DIR/sample2/docs/
  // app.getAppFolder('./docs/'),
  {
    allow: true,
  },
);
app.setUrl('https://app.local/index.html');

app.run();
