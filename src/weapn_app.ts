import { WebViewWindow } from './webview_window.ts';
import { winApi } from './libs/win_api.ts';
import {
  prepareWebview2DLL,
  WebMessageReceivedEventArgs,
  WebResourceRequestedEventArgs,
} from './libs/webview2.ts';
import type {
  PREPARE_WEBVIEW2_DLL_OPTION,
  WEAPN_CONFIG,
  WebView2,
} from './libs/webview2.ts';
import { isCompiled } from './support/compile.ts';
import { dirname, fromFileUrl, isAbsolute, join } from '@std/path';
import type { WeapnLogger } from './types.ts';
import { WeapnMessage } from './libs/message.ts';
import type { WeapnMessageFromClient } from '@azulamb/weapn/types';
import { MOVE_FOCUS_REASON } from './libs/webview2.ts';
import type { WeapnWorkerMessages } from './worker.ts';

type ImportMeta = {
  url: string;
  resolve: (specifier: string) => string;
};

/**
 * WeapnApp is the main application class for Weapn.
 */
export class WeapnApp {
  protected meta: ImportMeta;
  protected logger: WeapnLogger;
  protected isCompiled: boolean;
  protected url: URL;
  protected win: WebViewWindow;
  protected worker?: Worker;
  protected message?: WeapnMessage;
  protected onAfterInitWebView?: () => unknown;

  /**
   * @param importMeta Please pass import.meta from the main module.
   */
  constructor(importMeta: ImportMeta, option?: {
    logger?: WeapnLogger;
  }) {
    this.meta = importMeta;
    this.logger = option?.logger || {
      // No output logger.
      log: () => {},
      info: () => {},
      debug: () => {},
      warn: () => {},
      error: () => {},
    };
    this.url = new URL(this.meta.url);
    this.isCompiled = isCompiled(this.url);
    this.win = new WebViewWindow(this.logger);
    this.logger.info(`App: ${this.url}`);
    this.logger.info(
      `Weapn mode: ${this.isCompiled ? 'compiled' : 'development'}`,
    );
  }

  public setOnAfterInitWebView(callback: () => unknown): this {
    if (this.win.isPrepared()) {
      callback();
    } else {
      this.onAfterInitWebView = callback;
    }
    return this;
  }

  /**
   * Set the user data folder.
   * Use WEBVIEW2_USER_DATA_FOLDER env, so need --allow-env option.
   * @param dir The directory to set as the user data folder.
   * @returns The instance of the WeapnApp.
   */
  public setUserDataFolder(dir: string = '.\\.cache'): this {
    if (!isAbsolute(dir)) {
      dir = this.getAppFolder(dir);
    }
    // winApi.user.MessageBoxEx(null, `${this.compiled} ${dir}`, 'title');
    Deno.env.set('WEBVIEW2_USER_DATA_FOLDER', dir);
    this.logger.info(`Set WEBVIEW2_USER_DATA_FOLDER: ${dir}`);
    return this;
  }

  public getAppFolder(dir = './', basePath?: string): string {
    const baseDir = this.compiled
      ? dirname(winApi.kernel.GetModuleFileName())
      : (basePath ?? dirname(fromFileUrl(this.url)));
    return join(baseDir, dir);
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
  public get window(): WebViewWindow {
    return this.win;
  }

  /**
   * Get the WebView2 instance.
   * @returns The WebView2 instance.
   */
  public get webview2(): WebView2 {
    return this.win.webview2;
  }

  /**
   * Enable or disable the developer tools.
   * @param enabled True to enable, false to disable.
   */
  public set developerToolsEnabled(enabled: boolean) {
    this.webview2.settings.areDevToolsEnabled = enabled;
  }

  /**
   * Initialize the WebView2.
   * @param option The options for initializing the WebView2.
   */
  public async init(
    option?:
      & {
        webView2DllPath?: string;
      }
      & PREPARE_WEBVIEW2_DLL_OPTION
      & {
        weapn?: WEAPN_CONFIG;
      },
  ) {
    const hInstance = winApi.kernel.GetModuleHandle();
    this.win.init(hInstance);

    const webView2DllPath = option?.webView2DllPath || './webview2.dll';
    try {
      const dllInfo = await prepareWebview2DLL(webView2DllPath, option);
      this.logger.info(dllInfo);
      this.win.loadDll(dllInfo.path);
    } catch (error) {
      this.logger.error(error);
      winApi.user.MessageBoxEx(
        null,
        'webview2.dll not found',
        'Error',
        {
          MB_OK: true,
        },
      );
      Deno.exit(1);
    }

    this.win.initWindow();
    this.win.createWindow(option?.weapn);
    this.win.initWebView(() => {
      this.webview2.settings.areDevToolsEnabled = !this.isCompiled;
      this.afterInitWebView();
    });

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
   * Set the WeapnMessage.
   * @param message Set default WeapnMessage if not provided.
   */
  public setWeapnMessage(message?: WeapnMessage): this {
    if (!message) {
      message = new WeapnMessage();
    }
    this.message = message;
    this.initWeapnMessage();

    return this;
  }

  protected initWeapnMessage() {
    if (!(this.message && this.win.isPrepared())) {
      return;
    }
    console.log('Init WeapnMessage:');
    this.message.setWebview2(this.webview2);
    this.message.setWindowHandle(this.win.windowHandle);
    this.webview2.core.addWebMessageReceived((sender, args) => {
      const eventArgs = new WebMessageReceivedEventArgs(
        this.webview2.lib,
        args,
      );
      const message = eventArgs.WebMessageAsJson<WeapnMessageFromClient>();
      if (!message) {
        return 0;
      }

      return (<WeapnMessage> this.message).receiveMessage({
        _sender: sender,
        source: eventArgs.Source(),
        ...message,
      });
    });
  }

  protected afterInitWebView() {
    this.initWeapnMessage();
    if (this.onAfterInitWebView) {
      this.onAfterInitWebView();
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
    if (this.worker) {
      this.logger.info('Terminating worker:');
      this.worker.terminate();
      this.worker = undefined;
    }
  }

  //

  public setUrl(url: string): this {
    this.webview2.core.navigate(url);
    this.webview2.controllers.moveFocus = MOVE_FOCUS_REASON.PROGRAMMATIC;
    return this;
  }

  /*protected sendResponse(
    args: WebResourceRequestedEventArgs,
    response: Response,
  ) {
    console.log('=======================');
    console.log(args.Request.Uri);
    console.log(args.ResourceContextCode);
    console.log(args.ResourceContext);
    const content = JStream.create(
      new ResponseStream(this.webview2.lib).setResponse(response),
      //new FileResponseStream(this.webview2.lib).setFile(new URL(this.meta.resolve('./docs/index.html')))
    );

    console.log(`${response.status} ${response.statusText}`);
    const webview2Response = this.webview2.createWebResourceResponse(
      content,
      response.status,
      //'OK',//
      response.statusText ? response.statusText : 'Unknown',
      this.headersToString(response.headers),
    );
    args.Response = webview2Response;
  }*/

  addWebResourceRequested(
    //callback: (args: WebResourceRequestedEventArgs) => Response,
    workerPath: string,
  ) {
    const worker = new Worker(workerPath, { type: 'module' });
    const data: WeapnWorkerMessages = {
      type: 'init',
      ...this.win.exportData(),
    };
    worker.postMessage(data);
    this.webview2.core.addWebResourceRequested((_sender, eventArgs) => {
      const message = new WebResourceRequestedEventArgs(
        this.webview2.lib,
        eventArgs,
      );
      const deferral = message.getDeferral();
      console.log('Deferral created::::::::::', message.Request.Uri);
      const data: WeapnWorkerMessages = {
        type: 'request',
        eventArgs: Deno.UnsafePointer.value(eventArgs),
        deferral: Deno.UnsafePointer.value(deferral.getPointer()),
      };
      worker.postMessage(data);
      this.worker = worker;

      /*setTimeout(() => {
        console.log('waited');
        try {
          this.sendResponse(message, callback(message));
        } catch (_error) {
          this.sendResponse(
            message,
            new Response(
              '500 Internal Server Error',
              {
                status: 500,
                statusText: 'Internal Server Error',
              },
            ),
          );
        }
        console.log('complete');
        deferral.complete();
      }, 5000);*/

      console.log('end on requested.');
      return 0;
    });
  }
}
