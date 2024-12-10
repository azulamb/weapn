import { WeapnApp } from '../mod.ts';

Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', '.\\cache');

const app = new WeapnApp();

app.init();

app.run();
