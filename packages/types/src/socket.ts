import { ActivitySyncAction, Actions } from "./actions";

export const SUBSCRIBE_EVENT = 'subscribe';
export const UNSUBSCRIBE_EVENT = 'unsubscribe';
export const ACTION_EVENT = 'action';

export type SocketEvents =
  | typeof SUBSCRIBE_EVENT
  | typeof UNSUBSCRIBE_EVENT
  | typeof ACTION_EVENT;

export const USER_CHANNEL_PREFIX = 'user';
export const ACTIVITY_CHANNEL_PREFIX = 'activity';

export const isSocketAction = (action: Actions): action is ActivitySyncAction => {
  return (action as ActivitySyncAction).meta.toSocketId !== undefined;
};