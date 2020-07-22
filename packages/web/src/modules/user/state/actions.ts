import { User } from '@chess-tent/models';
import {
  UPDATE_USER,
  UpdateUserAction,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  UserLoggedInAction,
  UserLoggedOutAction,
} from '@types';

export const updateUserAction = (user: User): UpdateUserAction => ({
  type: UPDATE_USER,
  payload: user,
  meta: {
    id: user.id,
  },
});

export const userLoggedInAction = (user: User): UserLoggedInAction => ({
  type: USER_LOGGED_IN,
  payload: user,
  meta: {},
});

export const userLoggedOutAction = (): UserLoggedOutAction => ({
  type: USER_LOGGED_OUT,
  payload: {},
  meta: {},
});
