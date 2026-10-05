/**
 * Browser-side WebView2 message helpers and listener tokens.
 * Call these functions from frontend JavaScript running inside a Weapn window.
 * @module
 */
import type { WeapnMessageFromApp, WeapnMessageFromClient } from './types.ts';

// https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/javascript/hostobjectsasyncroot
type HostObjectsAsyncRoot = Record<string, unknown>;

declare const window: {
  chrome?: {
    // https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/javascript/webview
    webview: {
      hostObjects: HostObjectsAsyncRoot;
      addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) => void;
      postMessage: (message: unknown) => void;
      postMessageWithAdditionalObjects: (
        message: unknown,
        additionalObjects: ArrayLike<unknown>,
      ) => void;
      releaseBuffer(buffer: ArrayBuffer): void;
      removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
      ): void;
    };
  };
};

/** Opaque identity for a registered frontend event listener. */
export type WeapnEventToken = object;

/** Listener handle returned by {@link addWeapnMessage} and accepted by {@link removeWeapnMessage}. */
export type WeapnMessageEventToken = WeapnEventToken & {
  /** WebView2 message listener retained for removal. */
  listener: EventListenerOrEventListenerObject;
};

/**
 * Register a WebView2 message listener and return its removal token.
 * The current implementation logs received events; it does not invoke the callback.
 * @param _callback Reserved callback argument; currently unused.
 * @param options Options passed to WebView2's addEventListener.
 * @returns A listener token, or undefined when WebView2 is unavailable.
 */
export function addWeapnMessage(
  _callback: (data: WeapnMessageFromApp) => unknown,
  options?: boolean | AddEventListenerOptions,
): WeapnMessageEventToken | undefined {
  if (!window.chrome) {
    console.warn('Not running in a weapn.');
    return;
  }

  const token: WeapnMessageEventToken = {
    listener: (event: Event) => {
      console.log(event);
    },
  };
  window.chrome.webview.addEventListener(
    'message',
    token.listener,
    options,
  );

  return token;
}

/** Remove a listener using its token and the same capture option used during registration. */
export function removeWeapnMessage(
  token: WeapnMessageEventToken,
  options?: boolean | AddEventListenerOptions,
): void {
  if (!window.chrome) {
    console.warn('Not running in a weapn.');
    return;
  }
  window.chrome.webview.removeEventListener('message', token.listener, options);
}

/** Send a JSON-compatible message to the host application; warns outside WebView2. */
export function sendWeapnMessage(message: WeapnMessageFromClient): void {
  if (!window.chrome) {
    console.warn('Not running in a weapn.');
    return;
  }
  window.chrome.webview.postMessage(message);
}
