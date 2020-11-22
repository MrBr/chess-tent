import { services, requests } from '@application';
import { NotificationsResponse } from '@types';

const notifications = services.createRequest<
  boolean | undefined,
  NotificationsResponse
>('GET', (read?: boolean) => ({
  url: `/notifications?${!!read ? 'read=true' : ''}`,
}));

requests.notifications = notifications;
