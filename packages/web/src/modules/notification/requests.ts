import { services, requests } from '@application';
import {
  NotificationsResponse,
  StatusResponse,
  UpdateNotificationsRequest,
  Pagination,
} from '@types';

const notifications = services.createRequest<
  boolean | undefined,
  NotificationsResponse
>('GET', (read?: boolean, limit?: number) => ({
  url: `/notifications?${!!limit ? `limit=${limit}` : ''}${
    !!read ? 'read=true' : ''
  }`,
}));

const loadMoreNotifications = services.createRequest<
  Pagination,
  NotificationsResponse
>('GET', (lastDocumentTimestamp?: Pagination) => ({
  url: `/notifications?lastDocumentTimestamp=${lastDocumentTimestamp}`,
}));

const updateNotifications = services.createRequest<
  UpdateNotificationsRequest,
  StatusResponse
>('PUT', updatesForNotifications => ({
  url: '/notifications',
  data: updatesForNotifications,
}));

requests.notifications = notifications;
requests.loadMoreNotifications = loadMoreNotifications;
requests.updateNotifications = updateNotifications;
