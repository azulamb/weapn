import { type HMODULE, winApi } from '../libs/win_api.ts';
import { Icon, IconDirectory } from '../libs/icon.ts';

/**
 * Load multiple icons from a resource group.
 * @param resourceName The name of the icon group resource.
 * @param hModule The module handle. If not provided, uses the current module.
 * @returns An IconDirectory containing the loaded icons.
 */
export function LoadMultiIconFromIconGroupResource(
  resourceName: string,
  hModule?: HMODULE,
): IconDirectory {
  if (!hModule) {
    hModule = null;
  }
  const hResInfo = winApi.kernel.FindResourceEx(
    hModule,
    winApi.resourceType.RT_GROUP_ICON,
    resourceName,
  );
  if (!hResInfo) {
    throw new Error(`Resource ${resourceName} not found.`);
  }

  const hResData = winApi.kernel.LoadResource(null, hResInfo);
  const pData = winApi.kernel.LockResource(hResData);
  if (pData === null) {
    throw new Error(`Failed to load resource ${resourceName}.`);
  }

  const dwSize = winApi.kernel.SizeofResource(null, hResInfo);
  const groupData = new DataView(
    new Deno.UnsafePointerView(pData).getArrayBuffer(dwSize),
  );

  const iconDirectory = new IconDirectory();
  const max = groupData.getUint16(4, true);
  for (let i = 0; i < max; ++i) {
    const index = 6 + i * 14;
    const width = groupData.getUint8(index);
    const height = groupData.getUint8(index + 1);
    const colorCount = groupData.getUint8(index + 2);
    // const reserved = groupData.getUint8(index + 3);
    const planes = groupData.getUint16(index + 4, true);
    const bitCount = groupData.getUint16(index + 6, true);
    // const size = groupData.getUint32(index + 8, true);
    const id = groupData.getUint16(index + 12, true);

    const hIcon = winApi.kernel.FindResourceEx(
      hModule,
      winApi.resourceType.RT_ICON,
      winApi.macro.MAKEINTRESOURCE(BigInt(id)),
    );
    const hIconGlobal = winApi.kernel.LoadResource(hModule, hIcon);
    const iconSize = winApi.kernel.SizeofResource(hModule, hIcon);
    const pIconData = winApi.kernel.LockResource(hIconGlobal);
    if (pIconData === null) {
      continue;
    }
    const iconData = new DataView(
      new Deno.UnsafePointerView(pIconData).getArrayBuffer(iconSize),
    );
    iconDirectory.addIcon(
      new Icon(
        width,
        height,
        colorCount,
        planes,
        bitCount,
        new Uint8Array(
          iconData.buffer,
          iconData.byteOffset,
          iconData.byteLength,
        ),
      ),
    );
  }

  return iconDirectory;
}
