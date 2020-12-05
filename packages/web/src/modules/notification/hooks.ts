import { hooks, requests } from '@application';
import { Notification, TYPE_NOTIFICATION } from '@chess-tent/models';
import { useEffect } from 'react';
import { RecordHookReturn } from '@types';
import { useApi } from '../api/hooks';

const { useRecord } = hooks;

export const useActiveUserNotifications = (): RecordHookReturn<
  Notification[]
> => {
  const [notifications, setNotifications, resetNotifications] = useRecord<
    Notification[]
  >('notifications', TYPE_NOTIFICATION);
  const { fetch, response, loading, error, reset } = useApi(
    requests.notifications,
  );
  useEffect(() => {
    if (!response || notifications) {
      return;
    }
    setNotifications(response.data);
  }, [reset, response, setNotifications, notifications]);
  useEffect(() => {
    if (loading || response || error || notifications) {
      return;
    }
    fetch();
  }, [fetch, loading, response, error, notifications]);
  return [notifications, setNotifications, resetNotifications];
};
