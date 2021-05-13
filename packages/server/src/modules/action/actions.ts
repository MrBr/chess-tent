import { SyncAction, SYNC_ACTION } from '@chess-tent/types';
import { Entity } from '@chess-tent/models';

export const syncAction = (
  id: string,
  type: string,
  socketId: string,
  payload: Entity | undefined,
): SyncAction => ({
  type: SYNC_ACTION,
  payload,
  meta: {
    id,
    type,
    socketId,
  },
});
