import {
  ActiveUserAction,
  ActiveUserState,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
} from '@types';

export default (
  state: ActiveUserState = null,
  action: ActiveUserAction,
): ActiveUserState => {
  switch (action.type) {
    case USER_LOGGED_IN: {
      return action.payload.id;
    }
    case USER_LOGGED_OUT: {
      return null;
    }
    default: {
      return state;
    }
  }
};
