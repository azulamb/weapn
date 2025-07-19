export class Icon {
  constructor(
    readonly width: number,
    readonly height: number,
    readonly colorCount: number,
    readonly planes: number,
    readonly size: number,
    readonly buffer: Uint8Array,
  ) {
  }
}

export class IconDirectory {
  static async loadFromBuffer(
    buffer: Uint8Array | ArrayBuffer | Blob,
  ): Promise<IconDirectory> {
    if (buffer instanceof Blob) {
      return new IconDirectory().loadFromIconFile(
        new Uint8Array(await buffer.arrayBuffer()),
      );
    }
    if (buffer instanceof ArrayBuffer) {
      buffer = new Uint8Array(buffer);
    }
    if (!(buffer instanceof Uint8Array)) {
      throw new TypeError('Invalid buffer type');
    }
    return new IconDirectory().loadFromIconFile(buffer);
  }

  protected iconMode: boolean = true;
  protected icons: Icon[] = [];

  constructor() {
  }

  public loadFromIconFile(iconBuffer: Uint8Array): this {
    const data = new DataView(iconBuffer.buffer, 0, iconBuffer.byteLength);
    if (data.getUint16(0, true) !== 0) {
      throw new Error('Invalid icon.');
    }
    switch (data.getUint16(2, true)) {
      case 1:
        this.iconMode = true;
        break;
      case 2:
        this.iconMode = false;
        break;
      default:
        throw new Error('Unsupported icon format');
    }
    const iconCount = data.getUint16(4, true);
    if (iconCount <= 0) {
      throw new Error('No icons found in the directory');
    }
    for (let i = 0; i < iconCount; ++i) {
      const offset = 6 + i * 16;
      const width = data.getUint8(offset);
      const height = data.getUint8(offset + 1);
      const colorCount = data.getUint8(offset + 2);
      if (data.getUint8(offset + 3) !== 0) {
        throw new Error('Invalid icon format');
      }
      const planes = data.getUint16(offset + 4, true);
      const bitCount = data.getUint16(offset + 6, true);
      const size = data.getUint32(offset + 8, true);
      const offsetData = data.getUint32(offset + 12, true);
      const iconData = iconBuffer.slice(offsetData, offsetData + size);
      this.addIcon(
        new Icon(width, height, colorCount, planes, bitCount, iconData),
      );
    }

    return this;
  }

  get length() {
    return this.icons.length;
  }

  public icon(index: number): Icon {
    if (index < 0 || this.icons.length <= index) {
      throw new RangeError('Icon index out of range');
    }
    return this.icons[index];
  }

  public addIcon(icon: Icon): this {
    this.icons.push(icon);
    return this;
  }

  [Symbol.iterator]() {
    return new class {
      private index = 0;
      private icons: Icon[];
      constructor(icons: Icon[]) {
        this.icons = icons;
      }
      next() {
        const index = this.index++;
        return { value: this.icons[index], done: this.icons.length <= index };
      }
    }(this.icons);
  }
}
