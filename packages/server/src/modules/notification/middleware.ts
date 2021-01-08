import { service, socket } from '@application';
import { MiddlewareFunction } from '@types';
import { createNotification as modelCreateNotification } from '@chess-tent/models';
import * as notificationService from './service';
import { SEND_NOTIFICATION } from '@chess-tent/types';
import { NotificationNotPreparedError } from './errors';

export const createNotification: MiddlewareFunction = (req, res, next) => {
  const notification = modelCreateNotification(
    service.generateIndex(),
    res.locals.user,
    res.locals.notificationType,
    res.locals.state,
  );
  notificationService
    .saveNotification(notification)
    .then(() => {
      res.locals.notification = notification;
      next();
    })
    .catch(next);
};

export const sendNotification: MiddlewareFunction = (req, res, next) => {
  const notification = res.locals.notification;
  if (!notification) {
    throw new NotificationNotPreparedError();
  }
  socket.sendServerAction(`user-${notification.user.id}`, {
    type: SEND_NOTIFICATION,
    payload: notification,
    meta: {},
  });
  next();
};

export const getNotifications: MiddlewareFunction = (req, res, next) =>
  notificationService
    .getNotifications(res.locals.filters)
    .then(notifications => {
      res.locals.notifications = notifications;
      next();
    })
    .catch(next);
