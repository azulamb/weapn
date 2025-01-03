const IMPORT_SRC = './webview2/exports.h';
const EXPORT_TYPE = './src/webview2.d.ts';
const EXPORT_PARAMS = './src/webview2_params.ts';

// TODO: remake parser.

function convertType(type: string) {
  if (type.match(/\*$/)) {
    return 'pointer';
  }
  type = type.replace(/^const\s+/, '');
  switch (type) {
    case 'PCWSTR':
    case 'LPCWSTR':
    case 'HWND':
    case 'HRESULT':
      return 'pointer';
    case 'BOOL':
    case 'COREWEBVIEW2_MOVE_FOCUS_REASON':
    case 'COREWEBVIEW2_BOUNDS_MODE':
    case 'COREWEBVIEW2_CAPTURE_PREVIEW_IMAGE_FORMAT':
    case 'COREWEBVIEW2_WEB_RESOURCE_CONTEXT':
      return 'i32';
    case 'double':
      return 'f64';
    case 'EventRegistrationToken':
    case 'RECT':
    case 'COREWEBVIEW2_COLOR':
      return 'buffer'; //NativeStructType
  }
  throw new Error(`Unknown type: "${type}"`);
}

function parseArg(arg: string) {
  const type = arg.replace(/\/\*.+\*\//g, '').trim().split(/\s+/);
  console.log(type);
  if (!type[type.length - 1].match(/\)$/)) {
    type.pop();
  } else {
    // function
    return 'function';
  }
  return convertType(type.join(' '));
}

function parseArgs(args: string) {
  const list: string[] = [];
  let prev = '';
  args.replace(/\)$/, '').split(',').map((arg) => {
    if (prev) {
      arg = [prev, arg].join(',');
    }
    const tmp = arg.replace(/\([^\)]*\)/g, '');
    if (tmp.match(/\(/)) {
      prev = arg;
    } else {
      list.push(parseArg(arg));
      prev = '';
    }
  });

  return list;
}

function parseFunc(func: string) {
  const [info, ...arg] = func.split('(');
  const result = info.split(/\s+/);
  const name = <string> result.pop();
  console.log(name);
  const args = parseArgs(arg.join('('));

  return {
    name: name,
    parameters: args,
    result: convertType(result.join(' ')),
  };
}

async function parse(src: string) {
  const lines = (await Deno.readTextFile(src)).replace(/\r\n/g, '\n').split('\n');
  while (!lines[0].match(/^EXPORT/)) {
    lines.shift();
  }

  const funcs: string[] = [];
  let func: string = '';
  for (const line of lines) {
    if (line.match(/^EXPORT/)) {
      if (line.match(/\);$/)) {
        funcs.push(line.replace(/^EXPORT\s+/, '').replace(/\s*\);.*$/, ')'));
        func = '';
      } else {
        func = line;
      }
    } else if (line === ');') {
      func += line;
      funcs.push(func.replace(/^EXPORT\s+/, '').replace(/\s*\);.*$/, ')'));
      func = '';
    } else if (func) {
      func += line.trim();
    }
  }

  return funcs.map((func) => {
    return parseFunc(func);
  });
}

const list = await parse(IMPORT_SRC);

const types = `type WEBVIEW2_FUNCS = {
${
  list.map((data) => {
    return `  readonly ${data.name}: {
    readonly parameters: [${
      data.parameters.map((param) => {
        return `'${param}'`;
      }).join(', ')
    }];
    readonly result: '${data.result}';
  };`;
  }).join('\n')
}
};
`;

await Deno.writeTextFile(EXPORT_TYPE, types);

const params = `export const params: WEBVIEW2_FUNCS = {
${
  list.map((data) => {
    return `  ${data.name}: {
    parameters: [${
      data.parameters.map((param) => {
        return `'${param}'`;
      }).join(', ')
    }],
    result: '${data.result}',
  },`;
  }).join('\n')
}
};
`;

await Deno.writeTextFile(EXPORT_PARAMS, params);
