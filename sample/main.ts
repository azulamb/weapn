import { WeapnApp } from '@azulamb/weapn';

const app = new WeapnApp(import.meta, { logger: console });
app.setUserDataFolder();
app.setWeapnMessage();

await app.init({
  includePath: true,
  debugMode: true,
});
app.developerToolsEnabled = true;

app.webview2.core.addWebResourceRequestedFilter('http://app.local/*', 0);
app.addWebResourceRequested(
  import.meta.resolve('./worker.ts'),
  /*(message) => {
  console.log(message.Request.Uri);
  if (message.Request.Uri.match(/\/$/)) {
    console.log('load index.html');
    //console.log(await Deno.readTextFile(new URL(import.meta.resolve('./docs/index.html'))));
    const body = Deno.readTextFileSync(
      new URL(import.meta.resolve('./docs/index.html')),
    );
    console.log(body);
    return new Response(body, { headers: { 'Content-Type': 'text/html' } });
    /*return Deno.open(new URL(import.meta.resolve('./docs/index.html'))).then((input) => {
      console.log('return response');
      return new Response(input.readable, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    });* /
  }
  throw new Error('error');
}*/
);

//app.webview2.Navigate('https://www.google.co.jp/');
//app.webview2.Navigate(import.meta.resolve('./docs/index.html'));
app.setUrl('http://app.local/');

app.run();
