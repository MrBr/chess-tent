import { services, requests } from '@application';
import { Requests } from '@types';

const notifications = services.createRequest<Requests['notifications']>(
  'GET',
  (read, limit) =>
    `/notifications?${!!limit ? `limit=${limit}` : ''}${
      !!read ? 'read=true' : ''
    }`,
);

const loadMoreNotifications = services.createRequest<
  Requests['loadMoreNotifications']
>(
  'GET',
  lastDocumentTimestamp =>
    `/notifications?${
      !!lastDocumentTimestamp
        ? `lastDocumentTimestamp=${lastDocumentTimestamp}`
        : ''
    }`,
);

const updateNotifications = services.createRequest<
  Requests['updateNotifications']
>('PUT', '/notifications', updatesForNotifications => updatesForNotifications);

requests.notifications = notifications;
requests.loadMoreNotifications = loadMoreNotifications;
requests.updateNotifications = updateNotifications;
