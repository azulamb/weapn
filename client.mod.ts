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

export type WeapnEventToken = object;

type WeapnMessageEventToken = WeapnEventToken & {
  listener: EventListenerOrEventListenerObject;
};

/** */
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

export function sendWeapnMessage(message: WeapnMessageFromClient): void {
  if (!window.chrome) {
    console.warn('Not running in a weapn.');
    return;
  }
  window.chrome.webview.postMessage(message);
}
