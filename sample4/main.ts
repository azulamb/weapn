import { WeapnApp } from "@azulamb/weapn/app";

const app = new WeapnApp(import.meta, {
  title: "Weapn transparent canvas",
  width: 320,
  height: 320,
  transparent: true,
  decorations: false,
});
app.mountAssets(new URL("./docs/", import.meta.url));
app.onMessage(async ({ data }) => {
  if (data === "close") await app.window.close();
});
await app.start();
await app.setUrl("https://app.example/index.html");
await app.closed;
