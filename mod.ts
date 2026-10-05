/**
 * Windows desktop applications with a Worker-hosted WebView2 window and icon utilities.
 * @module
 */
import data from './deno.json' with { type: 'json' };
/** Version of the installed Weapn package. */
export const VERSION: string = data.version;
export * from './app.mod.ts';
export * from './src/libs/icon.ts';
