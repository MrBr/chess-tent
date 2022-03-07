export const SUBSCRIBE_EVENT = 'subscribe';
export const UNSUBSCRIBE_EVENT = 'unsubscribe';
export const UNSUBSCRIBED_EVENT = 'unsubscribed';
export const ACTION_EVENT = 'action';

export type SocketEvents =
  | typeof SUBSCRIBE_EVENT
  | typeof UNSUBSCRIBE_EVENT
  | typeof UNSUBSCRIBED_EVENT
  | typeof ACTION_EVENT;

export const USER_CHANNEL_PREFIX = 'user';
