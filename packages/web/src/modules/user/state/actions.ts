import { User } from '@chess-tent/models';
import { UPDATE_USER, UpdateUserAction } from '@types';

export const updateUserAction = (user: User): UpdateUserAction => ({
  type: UPDATE_USER,
  payload: user,
  meta: {
    id: user.id,
  },
});
