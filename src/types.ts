/** Console-compatible logging sink used by the main thread and native UI events. */
export interface WeapnLogger {
  /** Write general lifecycle messages. */
  log(...messages: unknown[]): void;
  /** Write informational messages and optional startup timings. */
  info(...messages: unknown[]): void;
  /** Write diagnostic messages. */
  debug(...messages: unknown[]): void;
  /** Write recoverable warnings. */
  warn(...messages: unknown[]): void;
  /** Write errors reported by the application or UI Worker. */
  error(...messages: unknown[]): void;
}
