import { WeapnApp } from "@azulamb/weapn/app";

const app = new WeapnApp(import.meta, {
  title: "Custom resource response",
  developerTools: true,
});
// Async application work stays on main; native response creation stays on the UI Worker.
app.onResourceRequest(async (request) => {
  const url = new URL(request.url);
  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    return new Response("Not found", { status: 404 });
  }
  const html = await Deno.readTextFile(
    new URL("./docs/index.html", import.meta.url),
  );
  return new Response(request.method === "HEAD" ? null : html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
app.onMessage(async ({ data }) => {
  if (data === "maximize") await app.window.maximize();
  if (data === "restore") await app.window.restore();
  if (data === "close") await app.window.close();
});
await app.start();
await app.setUrl("https://app.example/");
await app.closed;
