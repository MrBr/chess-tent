import { TYPE_NOTIFICATION, TYPE_USER, Notification } from '@chess-tent/models';
import { NotificationRenderer, NotificationView } from '@types';

const notificationRenderers: Record<
  Notification['notificationType'],
  NotificationRenderer<Notification>
> = {};

export const hasNotificationRender = (
  notificationType: Notification['notificationType'],
  view: NotificationView,
) => !!notificationRenderers[notificationType][view];

export const getNotificationRender = (
  notificationType: Notification['notificationType'],
  view: NotificationView,
) => notificationRenderers[notificationType][view];

export const registerNotificationRenderer = <T extends Notification>(
  notificationType: Notification['notificationType'],
  renderer: T extends Notification ? NotificationRenderer<T> : never,
) => {
  notificationRenderers[notificationType] = renderer;
};

export const notificationsSchema = {
  type: TYPE_NOTIFICATION,
  relationships: {
    user: TYPE_USER,
  },
};
