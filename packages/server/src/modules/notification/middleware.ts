import { service, socket } from '@application';
import { MiddlewareFunction } from '@types';
import { SEND_NOTIFICATION } from '@chess-tent/types';
import {
  createNotification as modelCreateNotification,
  Notification,
  User,
} from '@chess-tent/models';
import * as notificationService from './service';

import { NotificationNotPreparedError } from './errors';

export const createNotifications: MiddlewareFunction = async (
  req,
  res,
  next,
) => {
  const notifications = res.locals.notification.users.map((user: User) =>
    modelCreateNotification(
      service.generateIndex(),
      user,
      res.locals.notification.type,
      res.locals.notification.state,
    ),
  );

  await Promise.all(
    notifications.map((notification: Notification) =>
      notificationService.saveNotification(notification),
    ),
  )
    .then(() => {
      res.locals.notifications = notifications;
      next();
    })
    .catch(next);
};

export const sendNotifications: MiddlewareFunction = (req, res, next) => {
  const notifications = res.locals.notifications;
  if (!notifications) {
    throw new NotificationNotPreparedError();
  }

  notifications.forEach((notification: Notification) => {
    socket.sendServerAction(`user-${notification.user.id}`, {
      type: SEND_NOTIFICATION,
      payload: notification,
      meta: {},
    });
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

export const updateNotifications: MiddlewareFunction = (req, res, next) => {
  return notificationService
    .updateNotifications(
      {
        user: res.locals.me.id,
        _id: res.locals.notificationIds,
      },
      res.locals.notificationUpdate,
    )
    .then(next)
    .catch(next);
};
