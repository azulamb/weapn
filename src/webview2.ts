import { params } from './webview2_params.ts';

export function createWebView2(dllPath = 'webview2.dll') {
  return Deno.dlopen(
    dllPath,
    params,
  );
}
