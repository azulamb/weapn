export type WeapnWorkerMessageTypes = 'navigate';
export type WeapnWorkerMessage = {
  type: 'navigate';
  url: string;
};

export class WeapnMessage {
  protected worker: Worker;
  protected otherMessageHandlers!: (event: MessageEvent) => unknown;

  /**
   * @param worker Worker or path to worker file. default: './worker.ts'
   */
  constructor(worker?: Worker | string) {
    if (worker instanceof Worker) {
      this.worker = worker;
    } else {
      this.worker = new Worker(import.meta.resolve(worker ?? './worker.ts'), {
        type: 'module',
      });
    }
    this.setOtherMessageHandlers(() => {});
  }

  /**
   * Set the other message handlers.
   * @param handler The handler function to handle other messages.
   */
  public setOtherMessageHandlers(
    handler: (event: MessageEvent) => unknown,
  ): this {
    this.otherMessageHandlers = handler;
    return this;
  }

  /**
   * Send a message to the worker.
   * @param url The URL to navigate to.
   * @returns The WeapnWorkerMessage instance.
   */
  public Navigate(url: string): this {
    const message: WeapnWorkerMessage = { type: 'navigate', url: url };
    this.worker.postMessage(message);
    return this;
  }

  protected onMessage(event: MessageEvent) {
    /*if (event.data && event.data.type) {
      const data: WeapnWorkerMessage = event.data;
    }*/
    this.otherMessageHandlers(event);
  }

  /**
   * Start the worker.
   * @returns The WeapnMessage instance.
   */
  public start(): this {
    this.worker.onmessage = (event) => {
      this.onMessage(event);
    };
    return this;
  }

  /**
   * Stop the worker.
   * @returns The WeapnMessage instance.
   */
  public stop(): this {
    this.worker.terminate();
    return this;
  }
}
