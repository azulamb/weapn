/**
 * Message type identifiers sent from the client to the app.
 */
export type WeapnMessageTypeFromClient = 'navigate' | 'title';

/**
 * Reserved message type identifiers sent from the app to the client.
 */
export type WeapnMessageTypeFromApp = '';

/**
 * Default messages sent from the client to the app.
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

/**
 * Custom messages that may be sent from the client to the app.
 */
export type CustomWeapnMessageFromClient = {
  type: string;
} | WeapnMessageFromClient;

/**
 * Default messages sent from the app to the client.
 */
export type WeapnMessageFromApp = {
  type: WeapnMessageTypeFromApp;
};

/**
 * Custom messages that may be sent from the app to the client.
 */
export type CustomWeapnMessageFromApp = {
  type: string;
} & WeapnMessageFromApp;
