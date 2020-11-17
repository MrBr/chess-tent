import { services, requests } from '@application';
import { NotificationsResponse } from '@types';

const notifications = services.createRequest<boolean, NotificationsResponse>(
  'GET',
  read => ({ url: `/notifications?${read ? 'read=true' : ''}` }),
);

requests.notifications = notifications;
