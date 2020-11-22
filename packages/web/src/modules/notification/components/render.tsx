import React from 'react';
import { Components } from '@types';
import { getNotificationRender } from '../model';

const NotificationRender: Components['NotificationRender'] = ({
  notification,
  view,
}) => {
  const Render = getNotificationRender(notification.notificationType, view);
  return Render ? <Render notification={notification} /> : null;
};

export default NotificationRender;
