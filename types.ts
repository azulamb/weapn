export type WeapnMessageTypeFromClient = 'navigate' | 'title';
export type WeapnMessageTypeFromApp = '';

/**
 * Default send client to app message.
 */
export type WeapnMessageFromClient = {
  type: 'navigate';
  url: string;
} | {
  type: 'title';
  title: string;
} | {
  type: WeapnMessageTypeFromClient;
};

export type CustomWeapnMessageFromClient = {
  type: string;
} | WeapnMessageFromClient;

export type WeapnMessageFromApp = {
  type: WeapnMessageTypeFromApp;
};

export type CustomWeapnMessageFromApp = {
  type: string;
} & WeapnMessageFromApp;
