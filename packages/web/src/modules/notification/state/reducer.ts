import {
  NotificationAction,
  NotificationState,
  SEND_NOTIFICATION,
  UPDATE_ENTITIES,
  UPDATE_NOTIFICATION,
} from '@types';

export const reducer = (
  state: NotificationState = {},
  action: NotificationAction,
): NotificationState => {
  switch (action.type) {
    case SEND_NOTIFICATION: {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
          user: action.payload.user.id,
        },
      };
    }
    case UPDATE_NOTIFICATION: {
      return { ...state, [action.meta.id]: action.payload };
    }
    case UPDATE_ENTITIES: {
      return action.payload.notifications
        ? {
            ...state,
            ...action.payload.notifications,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
