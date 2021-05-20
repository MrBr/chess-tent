import { services } from '@application';
import { Notification, TYPE_NOTIFICATION } from '@chess-tent/models';

export const notificationRecordService = services.createRecordService<
  Notification[]
>('notifications', TYPE_NOTIFICATION);
