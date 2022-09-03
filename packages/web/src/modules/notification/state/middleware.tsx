import React from 'react';
import { Middleware, SEND_NOTIFICATION } from '@types';
import { services, components } from '@application';
import { hasNotificationRender } from '../model';
import { activeUserNotifications } from '../record';

const { pushToast } = services;
const { NotificationRender } = components;

export const notificationMiddleware: Middleware = store => next => action => {
  if (action.type === SEND_NOTIFICATION) {
    const notification = action.payload;
    const record = activeUserNotifications('notifications')(store);
    record.push(notification);
  }
  if (
    action.type === SEND_NOTIFICATION &&
    hasNotificationRender(action.payload.notificationType, 'Toast')
  ) {
    const notification = action.payload;
    pushToast(<NotificationRender notification={notification} view="Toast" />);
  }
  next(action);
};
