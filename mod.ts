import data from './deno.json' with { type: 'json' };
export const VERSION: string = data.version;
export * from './app.mod.ts';
export * from './src/libs/icon.ts';
