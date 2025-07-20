import { WebViewWindow } from './webview_window.ts';
import { winApi } from './libs/win_api.ts';
import {
  type PREPARE_WEBVIEW2_DLL_OPTION,
  prepareWebview2DLL,
} from './libs/webview2.ts';
import { isCompiled } from './support/compile.ts';
import { dirname, fromFileUrl, isAbsolute, join } from 'jsr:@std/path@^1.0.8';
import type { WeapnLogger } from './types.ts';

/**
 * WeapnApp is the main application class for Weapn.
 */
export class WeapnApp {
  protected logger: WeapnLogger;
  protected isCompiled: boolean;
  protected url: URL;
  protected win: WebViewWindow;

  /**
   * @param importMeta Please pass import.meta from the main module.
   */
  constructor(importMeta: { url: string }, option?: {
    logger?: WeapnLogger;
  }) {
    this.logger = option?.logger || {
      // No output logger.
      log: () => {},
      info: () => {},
      debug: () => {},
      warn: () => {},
      error: () => {},
    };
    this.url = new URL(importMeta.url);
    this.isCompiled = isCompiled(this.url);
    this.win = new WebViewWindow(this.logger);
    this.logger.info(`App: ${this.url}`);
    this.logger.info(
      `Weapn mode: ${this.isCompiled ? 'compiled' : 'development'}`,
    );
  }

  /**
   * Set the user data folder.
   * Use WEBVIEW2_USER_DATA_FOLDER env, so need --allow-env option.
   * @param dir The directory to set as the user data folder.
   * @returns The instance of the WeapnApp.
   */
  public setUserDataFolder(dir: string = '.\\.cache'): this {
    if (!isAbsolute(dir)) {
      const baseDir = this.compiled
        ? dirname(winApi.kernel.GetModuleFileName())
        : dirname(fromFileUrl(this.url));
      dir = join(baseDir, dir);
    }
    // winApi.user.MessageBoxEx(null, `${this.compiled} ${dir}`, 'title');
    Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', dir);
    this.logger.info(`Set WEBVIEW2_USER_DATA_FOLDER: ${dir}`);
    return this;
  }

  /**
   * Get the compiled status.
   * @returns true = compiled.
   */
  public get compiled(): boolean {
    return this.isCompiled;
  }

  /**
   * Get the WebViewWindow instance.
   * @returns The WebViewWindow instance.
   */
  public get window() {
    return this.win;
  }

  /**
   * Get the WebView2 instance.
   * @returns The WebView2 instance.
   */
  public get webview2() {
    return this.win.webview2;
  }

  /**
   * Initialize the WebView2.
   * @param option The options for initializing the WebView2.
   */
  public async init(
    option?: {
      webView2DllPath?: string;
    } & PREPARE_WEBVIEW2_DLL_OPTION,
  ) {
    const hInstance = winApi.kernel.GetModuleHandle();
    this.win.init(hInstance);

    const webView2DllPath = option?.webView2DllPath || './webview2.dll';
    const dllInfo = await prepareWebview2DLL(webView2DllPath, option);
    this.logger.info(dllInfo);
    this.win.loadDll(dllInfo.path);

    this.win.initWindow();
    this.win.createWindow();
    this.win.initWebView();

    this.win.show();

    const message = winApi.create.message();
    while (winApi.user.GetMessage(message.pointer, null, 0, 0)) {
      winApi.user.TranslateMessage(message.pointer);
      winApi.user.DispatchMessage(message.pointer);
      if (this.win.isPrepared()) {
        break;
      }
    }
  }

  /**
   * Run the application loop.
   * This method will block until the application is closed.
   */
  public run(onGetMessage?: () => unknown) {
    this.logger.log('Start loop:');
    const message = winApi.create.message();
    if (onGetMessage) {
      while (winApi.user.GetMessage(message.pointer, null, 0, 0)) {
        winApi.user.TranslateMessage(message.pointer);
        winApi.user.DispatchMessage(message.pointer);
        onGetMessage();
      }
    } else {
      while (winApi.user.GetMessage(message.pointer, null, 0, 0)) {
        winApi.user.TranslateMessage(message.pointer);
        winApi.user.DispatchMessage(message.pointer);
      }
    }
    this.logger.log('End loop:');
  }
}
