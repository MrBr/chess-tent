import {
  NotificationAction,
  NotificationState,
  SEND_NOTIFICATION,
} from '@types';
import { state } from '@application';
import { TYPE_NOTIFICATION } from '@chess-tent/models';

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
    default: {
      return state;
    }
  }
};

state.registerEntityReducer(TYPE_NOTIFICATION, reducer);
