import { winApi } from '../libs/win_api.ts';

/** Enable DWM alpha compositing without applying an opacity to the entire window. */
export function enableTransparentWindow(handle: Deno.PointerValue): void {
  let region: Deno.PointerValue = null;
  try {
    // Empty blur region: honor alpha without adding a blur to the desktop.
    region = winApi.gdi.CreateRectRgn(0, 0, -1, -1);
    if (!region) throw new Error('CreateRectRgn failed.');
    const data = new Uint8Array(24); // DWM_BLURBEHIND, Windows x64 alignment.
    const view = new DataView(data.buffer);
    view.setUint32(0, 3, true); // DWM_BB_ENABLE | DWM_BB_BLURREGION
    view.setInt32(4, 1, true);
    view.setBigUint64(8, Deno.UnsafePointer.value(region), true);
    const result = winApi.dwm.DwmEnableBlurBehindWindow(
      handle,
      Deno.UnsafePointer.of(data),
    );
    if (result < 0) {
      throw new Error(`DwmEnableBlurBehindWindow failed: ${result}`);
    }
  } finally {
    if (region) winApi.gdi.DeleteObject(region);
  }
}
