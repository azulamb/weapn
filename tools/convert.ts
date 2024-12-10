const EXPORT_SRC = './webview2/WebView2.cpp';

async function parse(src: string) {
  const lines = (await Deno.readTextFile(src)).replace(/\r\n/g, '\n').split('\n');
  while (!lines[0].match(/^EXPORT/)) {
    lines.shift();
  }

  const funcs: string[] = [];
  let func: string = '';
  for (const line of lines) {
    if (line.match(/^EXPORT/)) {
      func = line;
    } else if (line === '}') {
      func += line;
      // console.log(func);
      funcs.push(func.replace(/^EXPORT\s+/, '').replace(/\s*{.+$/, ''));
      func = '';
    } else if (func) {
      func += line.trim();
    }
  }

  return funcs.map((func) => {
    console.log(func);
    const [info, arg] = func.split('(');
    const result = info.split(/\s+/);
    const name = <string> result.pop();
    const args = arg.replace(/\)$/, '').split(/\s*,\s*/);
    return {
      name: name,
      parameters: args,
      result: result.join(' '),
    };
  });
}
