import { Notification, TYPE_NOTIFICATION } from "./types";
import { User } from "../user";

const isNotification = (entity: unknown): entity is Notification =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_NOTIFICATION;

const createNotification = (
  id: string,
  user: User,
  state = {}
): Notification => ({
  id,
  user,
  type: TYPE_NOTIFICATION,
  read: false,
  time: new Date(),
  state
});

export { isNotification, createNotification };
