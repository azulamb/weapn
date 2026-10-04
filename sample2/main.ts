// WebView2 serves a physical docs/ directory without a server or resource handler.
// Run from this directory: deno task start

import { WeapnApp } from "@azulamb/weapn/app";

const app = new WeapnApp(import.meta, { title: "Virtual host folder mapping" });
app.setVirtualHostNameToFolderMapping(
  "app.example",
  new URL("./docs/", import.meta.url),
);
app.onMessage(async ({ data }) => {
  if (data === "maximize") await app.window.maximize();
  if (data === "restore") await app.window.restore();
  if (data === "close") await app.window.close();
});
await app.start();
await app.setUrl("https://app.example/index.html");
await app.closed;
