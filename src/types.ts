export interface WeapnLogger {
  log(...messages: unknown[]): void;
  info(...messages: unknown[]): void;
  debug(...messages: unknown[]): void;
  warn(...messages: unknown[]): void;
  error(...messages: unknown[]): void;
}
