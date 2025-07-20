import data from './deno.json' with { type: 'json' };

export const VERSION = data.version;
export * from './src/weapn_app.ts';
export * from './src/weapn_worker.ts';

// Support library
export * from './src/icon.ts';
