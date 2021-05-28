import React from 'react';
import { Middleware, SEND_NOTIFICATION } from '@types';
import { services, components, state } from '@application';
import { hasNotificationRender } from '../model';
import { notificationRecordService } from '../service';

const { actions } = state;

const { updateEntities } = actions;
const { pushToast } = services;
const { NotificationRender } = components;

export const notificationMiddleware: Middleware = store => next => action => {
  if (action.type === SEND_NOTIFICATION) {
    const notification = action.payload;
    const { record, updateValue } = notificationRecordService(store);
    store.dispatch(updateEntities(notification));
    updateValue([...(record?.value || []), notification.id]);
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
