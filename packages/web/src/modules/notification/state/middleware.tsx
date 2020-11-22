import React from 'react';
import { Middleware, SEND_NOTIFICATION } from '@types';
import { services, components } from '@application';
import { hasNotificationRender } from '../model';

const { pushToast } = services;
const { NotificationRender } = components;

export const notificationMiddleware: Middleware = () => next => action => {
  if (
    action.type === SEND_NOTIFICATION &&
    hasNotificationRender(action.payload.notificationType, 'Toast')
  ) {
    pushToast(
      <NotificationRender notification={action.payload} view="Toast" />,
    );
  }
  next(action);
};
