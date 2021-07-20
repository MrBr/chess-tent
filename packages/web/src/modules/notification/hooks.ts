import { hooks, requests } from '@application';
import { useState, useEffect, useCallback } from 'react';
import first from 'lodash/first';
import { Hooks } from '@types';
import takeRight from 'lodash/takeRight';
import { activeUserNotifications } from './record';

const { useRecordInit, useApi } = hooks;

export const useActiveUserNotifications: Hooks['useActiveUserNotifications'] = (
  limit?: number,
) => {
  const record = useRecordInit(activeUserNotifications, 'notifications');
  const { load, value } = record;

  useEffect(() => {
    if (value) {
      return;
    }
    load();
  }, [value, load]);

  const notifications = limit ? takeRight(record.value, limit) : record.value;

  return { ...record, value: notifications };
};

export const useLoadMoreNotifications = (): [() => void, boolean, boolean] => {
  const { value: notifications, update: setNotifications } = useRecordInit(
    activeUserNotifications,
    'notifications',
  );

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
