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

  public setOtherMessageHandlers(handler: (event: MessageEvent) => unknown) {
    this.otherMessageHandlers = handler;
  }

  public Navigate(url: string) {
    const message: WeapnWorkerMessage = { type: 'navigate', url: url };
    this.worker.postMessage(message);
  }

  protected onMessage(event: MessageEvent) {
    /*if (event.data && event.data.type) {
      const data: WeapnWorkerMessage = event.data;
    }*/
    this.otherMessageHandlers(event);
  }

  public start() {
    this.worker.onmessage = (event) => {
      this.onMessage(event);
    };
  }

  public stop() {
    this.worker.terminate();
  }
}
