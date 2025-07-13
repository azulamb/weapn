import { copy } from '@azulamb/webview2/copy';

// Copy webview2.dll from @azulamb/webview2
await copy(
  './sample/webview2.dll',
  {
    log: true,
  },
);
