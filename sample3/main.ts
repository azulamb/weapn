import { WeapnApp } from "@azulamb/weapn/app";
const mainStartedAt = performance.now();
const startupTiming = Deno.args.includes("--startup-timing");
const exitAfterTiming = Deno.args.includes("--startup-timing-exit");
const hostFlag = Deno.args.indexOf("--startup-timing-host");
const host = hostFlag < 0 ? "app.example" : Deno.args[hostFlag + 1];
if (!host || host.startsWith("--")) {
  throw new Error("Specify a hostname after --startup-timing-host.");
}
const origin = new URL(`https://${host}`).origin;

const app = new WeapnApp(import.meta, {
  title: "Weapn UI Worker",
  backgroundColor: "#ffffff",
  startupTiming,
  resourceFilter: `${origin}/*`,
});
if (Deno.args.includes("--startup-timing-folder")) {
  app.setVirtualHostNameToFolderMapping(
    host,
    new URL("./docs/", import.meta.url),
  );
} else app.mountAssets(new URL("./docs/", import.meta.url), origin);
app.onMessage(async ({ data }) => {
  if (!data || typeof data !== "object" || !("type" in data)) {
    return;
  }
  switch (data.type) {
    case "weapn-ready":
      if (startupTiming && "navigation" in data) {
        console.info(
          "[Weapn timing] Browser navigation:",
          JSON.stringify(data.navigation),
        );
      }
      if (startupTiming) {
        console.info(
          `[Weapn timing] main entry → frontend ready (after two animation frames): ${
            (performance.now() - mainStartedAt).toFixed(1)
          } ms`,
        );
      }
      if (exitAfterTiming) await app.window.close();
      break;
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
await app.setUrl(`${origin}/index.html`);
// Timers and asynchronous application work continue while the window is open.
await app.closed;
