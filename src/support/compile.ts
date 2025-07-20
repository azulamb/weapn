/**
 * Check if the application is compiled.
 * @param importMetaUrl new URL(import.meta.url).
 * @returns true is compiled.
 */
export function isCompiled(importMetaUrl: URL): boolean {
  try {
    const stat = Deno.statSync(importMetaUrl);
    return stat.dev === 0 && stat.mode === 0;
  } catch (_error) {
    return false;
  }
}
