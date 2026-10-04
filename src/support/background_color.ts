export function isBackgroundColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}
export function backgroundColorChannels(
  value: string,
): { alpha: 255; red: number; green: number; blue: number } {
  if (!isBackgroundColor(value)) {
    throw new TypeError('backgroundColor must be #RRGGBB.');
  }
  const rgb = Number.parseInt(value.slice(1), 16);
  return {
    alpha: 255,
    red: rgb >>> 16,
    green: (rgb >>> 8) & 255,
    blue: rgb & 255,
  };
}
