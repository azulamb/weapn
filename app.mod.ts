/**
 * Application lifecycle, native window commands and frontend resource handlers.
 * Native libraries run in the UI Worker while application handlers run on the main thread.
 *
 * @example
 * ```ts
 * import { WeapnApp } from '@azulamb/weapn/app';
 * const app = new WeapnApp(import.meta, { title: 'My app' });
 * app.mountAssets(new URL('./docs/', import.meta.url));
 * await app.start();
 * await app.setUrl('https://app.example/index.html');
 * await app.closed;
 * ```
 * @module
 */
export * from './src/worker_app.ts';
