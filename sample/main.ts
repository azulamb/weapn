import { WeapnApp } from '../mod.ts';
import { dirname, fromFileUrl, join } from 'jsr:@std/path@^1.0.8';

const IS_COMPILED = (() => {
  try {
    const stat = Deno.statSync(new URL(import.meta.url));
    return stat.mode === 0 && stat.birthtime === null;
  } catch (_error) {
    return false;
  }
})();

const baseDir = IS_COMPILED
  ? Deno.cwd()
  : dirname(fromFileUrl(new URL(import.meta.url)));

Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', join(baseDir, '.\\cache'));
//const webview2DllPath = '../webview2/x64/Debug/webview2.dll';
//const webview2DllPath = join(baseDir, '../webview2/x64/Debug/webview2.dll');
//const webview2DllPath = join(baseDir, './webview2.dll');
//const webview2DllPath = join(dirname(fromFileUrl(new URL(import.meta.url))), '../webview2/x64/Release/webview2.dll');

const app = new WeapnApp();

/*app.window.setIcon(
  ...await Promise.all(['./icon_small.ico', './icon_big.ico'].map(async (icon) => {
    const buffer = Deno.readFileSync(new URL(import.meta.resolve(icon)));
    const icons = await IconDirectory.loadFromBuffer(buffer)
    return icons.icon(0).buffer;
  })),
);*/

//console.log(webview2DllPath);
//console.log(import.meta.resolve('./test'));
//console.log(Deno.execPath());
//console.log(Deno.env.get('DENO_COMPILED'));
//console.log(import.meta.url);
//console.log(Deno.mainModule);
//console.log(Deno.statSync(new URL(import.meta.url)));
//console.log(baseDir);
await app.init({
  includePath: true,
  debugMode: true,
});

app.webview2.Navigate('https://www.google.co.jp/');

app.run();
