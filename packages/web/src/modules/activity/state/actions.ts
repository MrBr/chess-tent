import { State, SYNC_ACTIVITY, SyncActivityAction } from '@types';

export const syncActivityAction: State['actions']['syncActivity'] = (
  activity,
  activityId,
  socketId,
): SyncActivityAction => ({
  type: SYNC_ACTIVITY,
  payload: activity,
  meta: {
    entityId: activityId,
    toSocketId: socketId,
  },
});
