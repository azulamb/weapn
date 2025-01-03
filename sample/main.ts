import { WeapnApp } from '../mod.ts';
import { join } from 'jsr:@std/path@^1.0.8';

Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', '.\\cache');
//const webview2DllPath = join(import.meta.dirname, '../webview2/x64/Release/webview2.dll');
const webview2DllPath = join(import.meta.dirname, '../webview2/x64/Debug/webview2.dll');
const app = new WeapnApp();

app.init({
  webView2DllPath: webview2DllPath,
});

app.run();
