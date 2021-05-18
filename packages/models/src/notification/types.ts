import { Subject } from '../subject';
import { User } from '../user';

export const TYPE_NOTIFICATION = 'notifications';

export interface Notification extends Subject {
  id: string;
  type: typeof TYPE_NOTIFICATION;
  notificationType: string;
  user: User;
  timestamp: number;
  read: boolean;
  seen: boolean;
  state: {};
}

export interface NormalizedNotification {
  id: Notification['id'];
  user: User['id'];
  notificationType: Notification['notificationType'];
  type: Notification['type'];
  timestamp: Notification['timestamp'];
  read: Notification['read'];
  seen: Notification['seen'];
  state: Notification['state'];
}

export interface NormalizedNotificationBucket {
  id: string;
  user: User['id'];
  count: number;
  notifications: NormalizedNotification[];
  type: typeof TYPE_NOTIFICATION;
}
