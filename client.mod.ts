import type { WeapnMessageFromApp, WeapnMessageFromClient } from './types';

// https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/javascript/hostobjectsasyncroot
interface HostObjectsAsyncRoot {}

declare const window: Window & typeof globalThis & {
  chrome?: {
    // https://learn.microsoft.com/ja-jp/microsoft-edge/webview2/reference/javascript/webview
    webview: {
      hostObjects: HostObjectsAsyncRoot;
      addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) => void;
      postMessage: (message: any) => void;
      postMessageWithAdditionalObjects: (
        message: any,
        additionalObjects: ArrayLike<any>,
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

export type WeapnEventToken = {};

type WeapnMessageEventToken = WeapnEventToken & {
  listener: EventListenerOrEventListenerObject;
};

/** */
export function addWeapnMessage(
  callback: (data: WeapnMessageFromApp) => unknown,
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
) {
  if (!window.chrome) {
    console.warn('Not running in a weapn.');
    return;
  }
  window.chrome.webview.removeEventListener('message', token.listener, options);
}

export function sendWeapnMessage(message: WeapnMessageFromClient) {
  if (!window.chrome) {
    console.warn('Not running in a weapn.');
    return;
  }
  window.chrome.webview.postMessage(message);
}
