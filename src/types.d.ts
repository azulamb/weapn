// deno-lint-ignore-file no-explicit-any
type WeapnLogger = {
  log: (...messages: any[]) => void;
  info: (...messages: any[]) => void;
  debug: (...messages: any[]) => void;
  warn: (...messages: any[]) => void;
  error: (...messages: any[]) => void;
};
