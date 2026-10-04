export type WindowAction =
  | 'maximize'
  | 'minimize'
  | 'restore'
  | 'title'
  | 'navigate'
  | 'close';
export interface UIOptions {
  dllPath: string;
  userDataFolder: string;
  title?: string;
  width?: number;
  height?: number;
  developerTools?: boolean;
  resourceFilter?: string;
  resourceTimeoutMs: number;
  virtualHosts?: VirtualHostMapping[];
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
  | { type: 'command'; id: number; action: WindowAction; value?: string }
  | { type: 'response'; id: number; response: ResourceResult };
export type FromUI =
  | { type: 'ready' | 'closed' }
  | { type: 'fatal'; error: string }
  | { type: 'result'; id: number; error?: string }
  | { type: 'message'; source: string; data: unknown }
  | { type: 'window'; message: number }
  | { type: 'request'; id: number; url: string; method: string };
