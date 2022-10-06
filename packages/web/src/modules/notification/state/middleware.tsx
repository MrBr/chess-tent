import React from 'react';
import { Middleware } from '@types';
import { PUSH_RECORD } from '@chess-tent/redux-record';
import { services, components } from '@application';
import { hasNotificationRender } from '../model';
import { activeUserNotifications } from '../record';

const { pushToast } = services;
const { NotificationRender } = components;

export const notificationMiddleware: Middleware = store => next => action => {
  next(action);
  if (action.type === PUSH_RECORD && action.meta.key === 'notifications') {
    const record = activeUserNotifications('notifications')(store);
    const notifications = record.get().value || [];
    const notification = notifications[notifications.length - 1];
    if (
      notification &&
      hasNotificationRender(notification.notificationType, 'Toast')
    ) {
      pushToast(
        <NotificationRender notification={notification} view="Toast" />,
      );
    }
  }
};
