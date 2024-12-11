const IMPORT_SRC = './webview2/packages.config';
const EXPORT_VERSION = './src/version.ts';

async function parse(src: string) {
  const packages: {
    name: string;
    version: string;
  }[] = [];

  const lines = (await Deno.readTextFile(src)).replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    if (line.trim().match(/^<package /)) {
      // <package id="Microsoft.Web.WebView2" version="1.0.1661.34" targetFramework="native" />
      const name = (<RegExpMatchArray> line.match(/id="([^"]+)"/))[1];
      const version = (<RegExpMatchArray> line.match(/version="([^"]+)"/))[1];
      if (!name || !version) {
        continue;
      }
      packages.push({
        name: name,
        version: version,
      });
    }
  }

  return packages;
}

const packages = await parse(IMPORT_SRC);

await Deno.writeTextFile(
  EXPORT_VERSION,
  packages.map((data) => {
    return `export const ${data.name.replaceAll('.', '_')} = '${data.version}';`;
  }).join('\n') + '\n',
);
