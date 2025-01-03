// https://learn.microsoft.com/ja-jp/windows/win32/api/eventtoken/ns-eventtoken-eventregistrationtoken
type EventRegistrationTokenPointerValue = Deno.PointerValue<Uint8Array>;
export class EventRegistrationToken {
  public data: Uint8Array;
  protected dataView: DataView;
  protected dataPointer: EventRegistrationTokenPointerValue;
  public endian: boolean;

  constructor() {
    /* typedef struct EventRegistrationToken {
      __int64 value;
    } EventRegistrationToken; */
    this.data = new Uint8Array(8);
    this.dataView = new DataView(this.data.buffer);
    this.dataPointer = Deno.UnsafePointer.of<Uint8Array>(this.data);
    // Set default endian.
    this.endian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  }

  get pointer() {
    return this.dataPointer;
  }
}
