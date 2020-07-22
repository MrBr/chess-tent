import { UPDATE_ENTITIES, UPDATE_USER, UserAction, UserState } from '@types';

export default (state: UserState = {}, action: UserAction): UserState => {
  switch (action.type) {
    case UPDATE_USER: {
      const userId = action.meta.id;
      const patch = action.payload;
      const user = state[userId];
      return {
        ...state,
        [userId]: {
          ...user,
          ...patch,
        },
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.users
        ? {
            ...state,
            ...action.payload.users,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
