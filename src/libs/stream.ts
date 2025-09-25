import { JStream } from './webview2.ts';

export class ResponseStream extends JStream {
  protected response?: Response;
  public setResponse(response: Response): this {
    this.response = response;
    return this;
  }

  public override read(
    pv: Deno.PointerValue, // [out]
    cb: number, // [in]
    pcbRead: Deno.PointerValue<Uint32Array>, // [out]
  ): number {
    if (!pv || !pcbRead) {
      return -1;
    }

    console.log('=== read:');
    console.log(pv);
    console.log(cb);
    console.log(pcbRead);
    console.log(Deno.UnsafePointer.value(pcbRead));
    if (this.response) {
      //const reader = this.response.body.getReader();

      const view1 = new Deno.UnsafePointerView(pv);
      const ab1 = view1.getArrayBuffer(4, 0);
      new Uint8Array(ab1).set([116, 101, 115, 116]);

      const view2 = new Deno.UnsafePointerView(pcbRead);
      const ab2 = view2.getArrayBuffer(4, 0);
      new Uint32Array(ab2).set([ab1.byteLength]);

      this.response = undefined;
    } else {
      const view = new Deno.UnsafePointerView(pcbRead);
      const ab = view.getArrayBuffer(4, 0);
      new Uint32Array(ab).set([0]);
    }

    return 0;
  }
  public override write(
    pv: Deno.PointerValue,
    cb: number,
    pcbWritten: Deno.PointerValue,
  ): number {
    console.log('=== write:');
    console.log(pv);
    console.log(cb);
    console.log(pcbWritten);
    return 0;
  }

  /*public seek(
    dlibMove: bigint,
    dwOrigin: number,
    plibNewPosition: Deno.PointerValue,
  ): number {
    console.log('=== seek:');
    console.log(dlibMove);
    console.log(dwOrigin);
    console.log(plibNewPosition);
    return 0;
  }*/

  /*public setSize(libNewSize: bigint): number {
    console.log('=== setSize:');
    console.log(libNewSize);
    return 0;
  }*/

  /*public copyTo(
    pstm: Deno.PointerValue,
    cb: bigint,
    pcbRead: Deno.PointerValue,
    pcbWritten: Deno.PointerValue,
  ): number {
    console.log('=== copyTo:');
    console.log(pstm);
    console.log(cb);
    console.log(pcbRead);
    console.log(pcbWritten);
    return 0;
  }*/

  /*public commit(grfCommitFlags: number): number {
    console.log('=== commit:');
    console.log(grfCommitFlags);
    return 0;
  }*/

  /*public revert(): number {
    console.log('=== revert:');
    return 0;
  }*/

  /*public lockRegion(
    libOffset: bigint,
    cb: bigint,
    dwLockType: number,
  ): number {
    console.log('=== lockRegion:');
    console.log(libOffset);
    console.log(cb);
    console.log(dwLockType);
    return 0;
  }*/

  /*public unlockRegion(
    libOffset: bigint,
    cb: bigint,
    dwLockType: number,
  ): number {
    console.log('=== unlockRegion:');
    console.log(libOffset);
    console.log(cb);
    console.log(dwLockType);
    return 0;
  }*/

  /*public stat(
    pstatstg: Deno.PointerValue,
    grfStatFlag: number,
  ): number {
    console.log('=== stat:');
    console.log(pstatstg);
    console.log(grfStatFlag);
    return 0;
  }*/

  /*public clone(ppstm: Deno.PointerValue): number {
    console.log('=== clone:');
    console.log(ppstm);
    return 0;
  }*/
}
