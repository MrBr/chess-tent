import { AppState } from '@types';
import { Notification, TYPE_NOTIFICATION } from '@chess-tent/models';
import { utils } from '@application';

export const selectNotification = (notificationId: Notification['id']) => (
  state: AppState,
): Notification | null =>
  utils.denormalize(notificationId, TYPE_NOTIFICATION, state.entities);

export const selectUserNotifications = (userId: Notification['user']['id']) => (
  state: AppState,
): Notification[] => {
  const notifications = Object.values(state.entities.notifications)
    .filter(notifications => notifications.user === userId)
    .map(notification =>
      utils.denormalize(notification.id, TYPE_NOTIFICATION, state.entities),
    );
  return notifications;
};
