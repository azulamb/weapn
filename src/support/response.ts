/** Buffers a response up to a fixed limit, cancelling its reader on abort or overflow. */
export async function readResponseBody(
  response: Response,
  limit: number,
  signal: AbortSignal,
): Promise<Uint8Array<ArrayBuffer>> {
  signal.throwIfAborted();
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  const abort = () => {
    void reader.cancel(signal.reason).catch(() => {});
  };
  signal.addEventListener('abort', abort, { once: true });
  try {
    while (true) {
      signal.throwIfAborted();
      const { value, done } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      total += value.length;
      if (total > limit) {
        throw new RangeError(`Response exceeds ${limit} bytes.`);
      }
      chunks.push(value);
    }
    const body = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    return body;
  } catch (error) {
    void reader.cancel(error).catch(() => {});
    throw error;
  } finally {
    signal.removeEventListener('abort', abort);
    reader.releaseLock();
  }
}
/** Stops awaiting a handler on cancellation; disposes a late response body. */
export function waitForResponse(
  promise: Promise<Response>,
  signal: AbortSignal,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    promise.then((response) => {
      if (signal.aborted && response instanceof Response) {
        void response.body?.cancel().catch(() => {});
      } else resolve(response);
    }, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
