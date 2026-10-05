import { winApi } from '../libs/win_api.ts';

/** Owns DPI awareness on the UI thread until all of its windows have been destroyed. */
export class WindowSizing {
  private previous: Deno.PointerValue;
  private closed = false;

  constructor() {
    // DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2 = (HANDLE)-4.
    this.previous = winApi.user.SetThreadDpiAwarenessContext(
      Deno.UnsafePointer.create(BigInt.asUintN(64, -4n)),
    );
    if (!this.previous) {
      throw new Error('SetThreadDpiAwarenessContext failed.');
    }
  }

  /** Width and height are content dimensions in 96-DPI logical pixels. */
  public resizeClient(
    handle: Deno.PointerValue,
    style: number,
    styleEx: number,
    width?: number,
    height?: number,
  ): void {
    if (width === undefined && height === undefined) return;
    const dpi = winApi.user.GetDpiForWindow(handle);
    if (!dpi) throw new Error('GetDpiForWindow failed.');
    const rect = new Int32Array(4);
    if (!winApi.user.GetClientRect(handle, Deno.UnsafePointer.of(rect))) {
      throw new Error('GetClientRect failed.');
    }
    const pixels = (value: number): number => {
      const scaled = Math.round(value * dpi / 96);
      if (!Number.isSafeInteger(value) || value <= 0 || scaled > 0x7fffffff) {
        throw new RangeError('Invalid content size.');
      }
      return scaled;
    };
    rect[2] = width === undefined ? rect[2] : pixels(width);
    rect[3] = height === undefined ? rect[3] : pixels(height);
    if (
      !winApi.user.AdjustWindowRectExForDpi(
        Deno.UnsafePointer.of(rect),
        style,
        0,
        styleEx,
        dpi,
      )
    ) throw new Error('AdjustWindowRectExForDpi failed.');
    this.position(handle, 0, 0, rect[2] - rect[0], rect[3] - rect[1], 0x16); // NOMOVE | NOZORDER | NOACTIVATE
  }

  /** Apply Windows' suggested rectangle when moving between monitors with different DPI. */
  public dpiChanged(handle: Deno.PointerValue, lparam: bigint): void {
    const pointer = Deno.UnsafePointer.create(BigInt.asUintN(64, lparam));
    if (!pointer) throw new Error('WM_DPICHANGED has no suggested rectangle.');
    const rect = new Int32Array(
      new Deno.UnsafePointerView(pointer).getArrayBuffer(16),
    );
    this.position(
      handle,
      rect[0],
      rect[1],
      rect[2] - rect[0],
      rect[3] - rect[1],
      0x14,
    ); // NOZORDER | NOACTIVATE
  }

  private position(
    handle: Deno.PointerValue,
    x: number,
    y: number,
    width: number,
    height: number,
    flags: number,
  ): void {
    if (
      width <= 0 || height <= 0 || width > 0x7fffffff || height > 0x7fffffff
    ) throw new RangeError('Invalid outer window size.');
    if (
      !winApi.user.SetWindowPos(
        handle,
        null,
        x,
        y,
        width,
        height,
        flags,
      )
    ) throw new Error('SetWindowPos failed.');
  }

  public close(): void {
    if (this.closed) return;
    winApi.user.SetThreadDpiAwarenessContext(this.previous);
    this.closed = true;
  }
}
