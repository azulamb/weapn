import type {
  CustomWeapnMessageFromClient,
  WeapnMessageFromClient,
  WeapnMessageTypeFromClient,
} from '../../types.ts';
import type { WebView2 } from './webview2.ts';
import type { HRESULT, HWND, LPVOID } from './win_api.ts';
import { winApi } from '../libs/win_api.ts';

const weapnMessageTypes: WeapnMessageTypeFromClient[] =
  ((object: { [keys in WeapnMessageTypeFromClient]: null }) => {
    return Object.keys(object) as WeapnMessageTypeFromClient[];
  })({
    navigate: null,
    title: null,
  });

/**
 * WeapnWebMessage is the message type used in Weapn.
 */
export type WeapnWebMessage = WeapnMessageFromClient & {
  _sender: LPVOID;
  // Source URL.
  source: string;
};

/**
 * WeapnWebMessage is the message type used in Weapn.
 */
export class WeapnMessage {
  protected disableTypes: WeapnMessageTypeFromClient[] = [];
  protected enableTypes: WeapnMessageTypeFromClient[] = [];
  protected webview2!: WebView2;
  protected windowHandle?: HWND;

  constructor() {}

  public setWebview2(webview2: WebView2): this {
    this.webview2 = webview2;
    return this;
  }

  public setWindowHandle(handle: HWND): this {
    this.windowHandle = handle;
    return this;
  }

  /**
   * Set the types to disable.
   * @param types
   * @returns
   */
  public setDisableTypes(...types: WeapnMessageTypeFromClient[]): this {
    this.disableTypes = types;
    return this;
  }

  /**
   * Set the types to enable.
   * @param types
   * @returns
   */
  public setEnableTypes(...types: WeapnMessageTypeFromClient[]): this {
    this.enableTypes = types;
    return this;
  }

  protected isCustomType(message: CustomWeapnMessageFromClient): boolean {
    return !weapnMessageTypes.includes(message.type as 'title');
  }

  protected isDisableType(message: WeapnMessageFromClient): boolean {
    if (!message.type) {
      return true;
    }
    if (this.disableTypes.length <= 0) {
      return false;
    }
    return this.disableTypes.includes(message.type);
  }

  protected isEnableType(message: WeapnMessageFromClient): boolean {
    if (!message.type) {
      return false;
    }
    if (this.enableTypes.length <= 0) {
      return true;
    }
    return this.enableTypes.includes(message.type);
  }

  /**
   * Handle the message.
   * @param message
   * @returns HRESULT
   */
  public receiveMessage(message: WeapnWebMessage): HRESULT {
    if (this.isDisableType(message)) {
      return 0;
    }

    if (this.isCustomType(message)) {
      return this.onCustomMessage(message);
    }

    if (!this.isEnableType(message)) {
      return 0;
    }

    switch (message.type) {
      case 'navigate':
        return this.onNavigate(
          message as Extract<WeapnWebMessage, { type: 'navigate' }>,
        );
      case 'title':
        return this.onTitle(
          message as Extract<WeapnWebMessage, { type: 'title' }>,
        );
    }

    return 0;
  }

  /**
   * Need to override this method to handle custom messages.
   * @param message
   * @returns HRESULT default return is 0.
   */
  // deno-lint-ignore no-unused-vars
  public onCustomMessage(message: CustomWeapnMessageFromClient): HRESULT {
    return 0;
  }

  protected onNavigate(
    message: Extract<WeapnWebMessage, { type: 'navigate' }>,
  ): HRESULT {
    this.webview2.Navigate(message.url);
    return 0;
  }

  protected onTitle(
    message: Extract<WeapnWebMessage, { type: 'title' }>,
  ): HRESULT {
    if (!this.windowHandle) {
      return 0;
    }
    winApi.user.SetWindowText(this.windowHandle, message.title);
    return 0;
  }
}
