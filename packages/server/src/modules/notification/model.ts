import {
  TYPE_NOTIFICATION,
  TYPE_USER,
  NormalizedNotification,
  Notification
} from "@chess-tent/models";
import { db } from "@application";
import { Schema } from "mongoose";

const notificationSchema = db.createSchema<NormalizedNotification>({
  type: ({
    type: String,
    default: TYPE_NOTIFICATION
  } as unknown) as typeof TYPE_NOTIFICATION,
  notificationType: ({
    type: String,
    required: true
  } as unknown) as string,
  user: ({
    type: String,
    ref: TYPE_USER
  } as unknown) as NormalizedNotification["user"],
  read: (Schema.Types.Boolean as unknown) as NormalizedNotification["read"],
  state: (Schema.Types.Mixed as unknown) as NormalizedNotification["state"],
  time: (Schema.Types.Date as unknown) as NormalizedNotification["time"]
});

const NotificationModel = db.createModel<NormalizedNotification>(
  TYPE_NOTIFICATION,
  notificationSchema
);

const depopulate = (notification: Notification): NormalizedNotification => ({
  ...notification,
  user: notification.user.id
});

export { notificationSchema, NotificationModel, depopulate };
