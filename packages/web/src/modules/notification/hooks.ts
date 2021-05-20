import { hooks, requests } from '@application';
import { Notification, TYPE_NOTIFICATION } from '@chess-tent/models';
import { useState, useEffect, useCallback } from 'react';
import { RecordHookReturn } from '@types';
import first from 'lodash/first';
import take from 'lodash/take';
import { useApi } from '../api/hooks';

const { useRecord } = hooks;

export const useActiveUserNotifications = (
  limit?: number,
): RecordHookReturn<Notification[]> => {
  const [
    notifications,
    setNotifications,
    resetNotifications,
    notificationsMeta,
  ] = useRecord<Notification[]>('notifications', TYPE_NOTIFICATION);
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
  const finalNotifications = limit ? take(notifications, limit) : notifications;

  return [
    finalNotifications,
    setNotifications,
    resetNotifications,
    notificationsMeta,
  ];
};

export const useLoadMoreNotifications = (): [() => void, boolean, boolean] => {
  const [notifications, setNotifications] = useActiveUserNotifications();
  const [noMore, setNoMore] = useState(
    notifications ? notifications.length === 0 : false,
  );
  const { fetch, response, loading, reset } = useApi(
    requests.loadMoreNotifications,
  );
  useEffect(() => {
    if (response) {
      reset();
      if (response.data.length === 0) {
        setNoMore(true);
      }
      setNotifications([...response.data, ...(notifications || [])]);
    }
  }, [notifications, reset, response, setNotifications]);
  const loadMore = useCallback(() => {
    const firstNotification = first(notifications);
    if (noMore || loading || !firstNotification) {
      return;
    }
    fetch(firstNotification.timestamp);
  }, [fetch, loading, noMore, notifications]);
  return [loadMore, loading || !!response, noMore];
};
