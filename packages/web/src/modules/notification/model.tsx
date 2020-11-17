import { TYPE_NOTIFICATION, TYPE_USER } from '@chess-tent/models';

export const notificationSchema = {
  type: TYPE_NOTIFICATION,
  relationships: {
    user: TYPE_USER,
  },
};
