import { build } from "@azulamb/weapn/build";

await build({
  entry: "./main.ts",
  output: "./dist/app.exe",
  assets: ["./docs/"],
  // Resolve the package Worker entry; no application Worker file is generated.
  workers: [import.meta.resolve("@azulamb/weapn/worker")],
});
