import { Subject } from "../subject";
import { User } from "../user";

export const TYPE_NOTIFICATION = "notifications";

export interface Notification extends Subject {
  id: string;
  type: typeof TYPE_NOTIFICATION;
  notificationType: string;
  user: User;
  time: Date;
  read: boolean;
  state: {};
}

export interface NormalizedNotification {
  id: Notification["id"];
  user: User["id"];
  notificationType: Notification["notificationType"];
  type: Notification["type"];
  time: Notification["time"];
  read: Notification["read"];
  state: Notification["state"];
}
