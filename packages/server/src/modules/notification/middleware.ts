import { service, socket } from "@application";
import { MiddlewareFunction } from "@types";
import { createNotification as modelCreateNotification } from "@chess-tent/models";
import * as notificationService from "./service";
import { SEND_NOTIFICATION } from "@chess-tent/types";

export const createNotification: MiddlewareFunction = (req, res, next) => {
  notificationService
    .saveNotification(
      modelCreateNotification(
        service.generateIndex(),
        res.locals.user,
        res.locals.state
      )
    )
    .then(next)
    .catch(next);
};

export const sendNotification: MiddlewareFunction = (req, res, next) => {
  const notification = modelCreateNotification(
    service.generateIndex(),
    res.locals.user,
    res.locals.state
  );
  notificationService
    .saveNotification(notification)
    .then(() =>
      socket.sendServerAction(`user-${notification.user.id}`, {
        type: SEND_NOTIFICATION,
        payload: notification
      })
    )
    .then(next)
    .catch(next);
};

export const getNotifications: MiddlewareFunction = (req, res, next) => {
  notificationService
    .getNotifications(res.locals.filters)
    .then(notifications => {
      res.locals.notifications = notifications;
      next();
    })
    .catch(next);
};
