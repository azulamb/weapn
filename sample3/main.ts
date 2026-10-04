import { WeapnApp } from "@azulamb/weapn/app";

const app = new WeapnApp(import.meta, {
  title: "Weapn UI Worker",
  backgroundColor: "#ffffff",
});
app.mountAssets(new URL("./frontend/", import.meta.url));
app.onMessage(async ({ data }) => {
  if (!data || typeof data !== "object" || !("type" in data)) {
    return;
  }
  switch (data.type) {
    case "maximize":
      await app.window.maximize();
      break;
    case "restore":
      await app.window.restore();
      break;
    case "title":
      await app.window.setTitle("Changed from main.ts");
      break;
    case "close":
      await app.window.close();
      break;
  }
});
await app.start();
await app.setUrl("https://app.local/index.html");
// Timers and asynchronous application work continue while the window is open.
await app.closed;
