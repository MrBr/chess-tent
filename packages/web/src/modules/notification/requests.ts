import { services, requests } from '@application';
import { NotificationsResponse, StatusResponse } from '@types';
import { Notification } from '@chess-tent/models';

const notifications = services.createRequest<
  boolean | undefined,
  NotificationsResponse
>('GET', (read?: boolean) => ({
  url: `/notifications?${!!read ? 'read=true' : ''}`,
}));

const updateNotifications = services.createRequest<
  { ids: Notification['id'][]; updates: Partial<Notification> },
  StatusResponse
>('PUT', updatesForNotifications => ({
  url: '/notifications',
  data: updatesForNotifications,
}));

requests.notifications = notifications;
requests.updateNotifications = updateNotifications;
