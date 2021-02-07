import { services, requests } from '@application';
import {
  NotificationsResponse,
  StatusResponse,
  UpdateNotificationsRequest,
} from '@types';

const notifications = services.createRequest<
  boolean | undefined,
  NotificationsResponse
>('GET', (read?: boolean) => ({
  url: `/notifications?${!!read ? 'read=true' : ''}`,
}));

const updateNotifications = services.createRequest<
  UpdateNotificationsRequest,
  StatusResponse
>('PUT', updatesForNotifications => ({
  url: '/notifications',
  data: updatesForNotifications,
}));

requests.notifications = notifications;
requests.updateNotifications = updateNotifications;
