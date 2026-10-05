import { build } from "@azulamb/weapn/build";

await build({
  entry: "./main.ts",
  output: "./dist/app.exe",
  assets: ["./docs/"],
});
