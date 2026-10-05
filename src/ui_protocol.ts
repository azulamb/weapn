import { isBackgroundColor } from './support/background_color.ts';
export type WindowAction =
  | 'maximize'
  | 'minimize'
  | 'restore'
  | 'title'
  | 'navigate'
  | 'close';
export type WindowCommand =
  | { action: 'title' | 'navigate'; value: string }
  | { action: Exclude<WindowAction, 'title' | 'navigate'>; value?: never };
export interface UIOptions {
  dllPath: string;
  userDataFolder: string;
  title?: string;
  width?: number;
  height?: number;
  developerTools?: boolean;
  transparent?: boolean;
  decorations?: boolean;
  backgroundColor?: string;
  startupTiming?: boolean;
  resourceFilter?: string;
  resourceTimeoutMs: number;
  virtualHosts?: VirtualHostMapping[];
  maxConcurrentRequests: number;
  maxResponseBytes: number;
}
export interface VirtualHostMapping {
  hostName: string;
  folderPath: string;
  accessKind: 'deny' | 'allow' | 'denyCors';
}
export interface ResourceResult {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: Uint8Array;
}
export type ToUI =
  | { type: 'init'; options: UIOptions }
  | ({ type: 'command'; id: number } & WindowCommand)
  | { type: 'response'; id: number; response: ResourceResult };
export type FromUI =
  | { type: 'timing'; stage: string; durationMs: number }
  | { type: 'ready' | 'closed' }
  | { type: 'fatal'; error: string }
  | { type: 'result'; id: number; error?: string }
  | { type: 'message'; source: string; data: unknown }
  | { type: 'window'; message: number }
  | { type: 'request'; id: number; url: string; method: string }
  | { type: 'cancel'; id: number }
  | {
    type: 'log';
    level: 'log' | 'info' | 'debug' | 'warn' | 'error';
    messages: string[];
  };

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
function positive(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}
function optionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}
function response(value: unknown): value is ResourceResult {
  return record(value) && typeof value.status === 'number' &&
    Number.isInteger(value.status) && value.status >= 100 &&
    value.status <= 599 &&
    typeof value.statusText === 'string' && !/[\r\n]/.test(value.statusText) &&
    value.body instanceof Uint8Array && Array.isArray(value.headers) &&
    value.headers.every((header) =>
      Array.isArray(header) && header.length === 2 &&
      header.every((part) => typeof part === 'string' && !/[\r\n]/.test(part))
    );
}
export function isFromUI(value: unknown): value is FromUI {
  if (!record(value)) return false;
  switch (value.type) {
    case 'timing':
      return typeof value.stage === 'string' &&
        typeof value.durationMs === 'number' &&
        Number.isFinite(value.durationMs) && value.durationMs >= 0;
    case 'ready':
    case 'closed':
      return true;
    case 'fatal':
      return typeof value.error === 'string';
    case 'cancel':
      return positive(value.id);
    case 'result':
      return positive(value.id) && optionalString(value.error);
    case 'message':
      return typeof value.source === 'string' && 'data' in value;
    case 'window':
      return typeof value.message === 'number' &&
        Number.isInteger(value.message);
    case 'request':
      return positive(value.id) && typeof value.url === 'string' &&
        (value.method === 'GET' || value.method === 'HEAD');
    case 'log':
      return ['log', 'info', 'debug', 'warn', 'error'].includes(
        String(value.level),
      ) && Array.isArray(value.messages) && value.messages.every((part) =>
        typeof part === 'string'
      );
    default:
      return false;
  }
}
export function isToUI(value: unknown): value is ToUI {
  if (!record(value)) return false;
  if (value.type === 'command') {
    return positive(value.id) &&
      (value.action === 'title' || value.action === 'navigate'
        ? typeof value.value === 'string'
        : ['maximize', 'minimize', 'restore', 'close'].includes(
          String(value.action),
        ) && value.value === undefined);
  }
  if (value.type === 'response') {
    return positive(value.id) && response(value.response);
  }
  if (value.type !== 'init' || !record(value.options)) return false;
  const options = value.options;
  return typeof options.dllPath === 'string' &&
    typeof options.userDataFolder === 'string' &&
    positive(options.resourceTimeoutMs) &&
    positive(options.maxConcurrentRequests) &&
    positive(options.maxResponseBytes) && optionalString(options.title) &&
    optionalString(options.resourceFilter) &&
    (options.backgroundColor === undefined ||
      isBackgroundColor(options.backgroundColor)) &&
    (options.width === undefined || positive(options.width)) &&
    (options.height === undefined || positive(options.height)) &&
    (options.developerTools === undefined ||
      typeof options.developerTools === 'boolean') &&
    (options.transparent === undefined ||
      typeof options.transparent === 'boolean') &&
    (options.decorations === undefined ||
      typeof options.decorations === 'boolean') &&
    (options.startupTiming === undefined ||
      typeof options.startupTiming === 'boolean') &&
    (options.virtualHosts === undefined ||
      Array.isArray(options.virtualHosts) &&
        options.virtualHosts.every((mapping) =>
          record(mapping) &&
          typeof mapping.hostName === 'string' &&
          typeof mapping.folderPath === 'string' &&
          ['deny', 'allow', 'denyCors'].includes(String(mapping.accessKind))
        ));
}
