import { WeapnApp } from './weapn_app.ts';
import { WeapnWorkerMessage } from './worker_message.ts';

export class WeapnInWorker {
  protected worker: Worker;
  protected weapn: WeapnApp;
  protected otherMessageHandlers!: (event: MessageEvent) => unknown;

  constructor(worker: Worker, weapn: WeapnApp) {
    this.worker = worker;
    this.weapn = weapn;
    this.setOtherMessageHandlers(() => {});
  }

  public setOtherMessageHandlers(handler: (event: MessageEvent) => unknown) {
    this.otherMessageHandlers = handler;
  }

  public onMessage(event: MessageEvent) {
    if (event.data && event.data.type) {
      const data: WeapnWorkerMessage = event.data;
      switch (data.type) {
        case 'navigate': {
          return this.weapn.webview2.Navigate(data.url);
        }
      }
    }
    this.otherMessageHandlers(event);
  }
}

/**
 * @param worker
 * @param weapn After init() is called.
 */
export function WeapnWorker(worker: Worker, weapn: WeapnApp) {
  const weapnInWorker = new WeapnInWorker(worker, weapn);

  worker.onmessage = (event) => {
    weapnInWorker.onMessage(event.data);
  };

  return weapnInWorker;
}
