import { isFromUI, isToUI } from '../src/ui_protocol.ts';
import { readResponseBody } from '../src/support/response.ts';
import { WeapnApp as DefaultApp } from '../mod.ts';
import { WeapnApp } from '../app.mod.ts';
function assert(value: unknown): asserts value {
  if (!value) throw new Error('Assertion failed');
}
Deno.test('protocol rejects invalid IDs, commands and native response headers', () => {
  assert(DefaultApp === WeapnApp);
  assert(!isToUI({ type: 'command', id: 1, action: 'title' }));
  assert(
    !isToUI({ type: 'command', id: 1, action: 'close', value: 'unexpected' }),
  );
  assert(
    !isFromUI({
      type: 'request',
      id: -1,
      url: 'https://app.example/',
      method: 'GET',
    }),
  );
  assert(
    !isFromUI({
      type: 'request',
      id: 1,
      url: 'https://app.example/',
      method: 'POST',
    }),
  );
  assert(
    !isToUI({
      type: 'response',
      id: 1,
      response: {
        status: 200,
        statusText: 'OK',
        headers: [['x-test', 'bad\r\nheader']],
        body: new Uint8Array(),
      },
    }),
  );
  assert(isToUI({ type: 'command', id: 1, action: 'title', value: 'valid' }));
  assert(isFromUI({ type: 'cancel', id: 1 }));
  assert(
    isFromUI({
      type: 'timing',
      stage: 'Controller creation',
      durationMs: 12.5,
    }),
  );
  assert(
    !isFromUI({
      type: 'timing',
      stage: 'Controller creation',
      durationMs: NaN,
    }),
  );
  assert(
    !isFromUI({ type: 'timing', stage: 'Controller creation', durationMs: -1 }),
  );
});
Deno.test('response buffering cancels on overflow and abort', async () => {
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(10));
    },
    cancel() {
      cancelled = true;
    },
  });
  let failed = false;
  try {
    await readResponseBody(new Response(body), 5, new AbortController().signal);
  } catch (error) {
    failed = error instanceof RangeError;
  }
  assert(failed && cancelled);
  cancelled = false;
  const controller = new AbortController();
  const pending = readResponseBody(
    new Response(
      new ReadableStream({
        cancel() {
          cancelled = true;
        },
      }),
    ),
    5,
    controller.signal,
  );
  controller.abort(new Error('cancelled'));
  try {
    await pending;
  } catch {
    failed = true;
  }
  assert(failed && cancelled);
});
