import {
  TYPE_NOTIFICATION,
  TYPE_USER,
  NormalizedNotification,
  Notification,
} from '@chess-tent/models';
import { db } from '@application';
import { Schema } from 'mongoose';
import { User } from '@chess-tent/models/src';

export interface NormalizedNotificationBucket {
  id: string;
  user: User['id'];
  count: number;
  notifications: NormalizedNotification[];
  type: typeof TYPE_NOTIFICATION;
}

const notificationSchema = db.createSchema<NormalizedNotificationBucket>({
  type: {
    type: String,
    default: TYPE_NOTIFICATION,
  } as unknown as typeof TYPE_NOTIFICATION,
  user: {
    type: String,
    ref: TYPE_USER,
  } as unknown as NormalizedNotification['user'],
  count: {
    type: Number,
  } as unknown as NormalizedNotificationBucket['count'],
  notifications: {
    type: Schema.Types.Mixed,
  } as unknown as NormalizedNotificationBucket['notifications'],
});

const NotificationModel = db.createModel<NormalizedNotification>(
  TYPE_NOTIFICATION,
  notificationSchema,
);

const depopulate = (notification: Notification): NormalizedNotification => ({
  ...notification,
  user: notification.user.id,
});

export { notificationSchema, NotificationModel, depopulate };
