import { UPDATE_NOTIFICATION, UpdateNotificationAction } from '@types';
import { Notification } from '@chess-tent/models';

export const updateNotificationAction = (
  notification: Notification,
): UpdateNotificationAction => ({
  type: UPDATE_NOTIFICATION,
  payload: {
    ...notification,
    user: notification.user.id,
  },
  meta: { id: notification.id },
});
