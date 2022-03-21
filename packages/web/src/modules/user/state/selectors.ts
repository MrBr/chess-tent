import { TYPE_USER, User } from '@chess-tent/models';
import { AppState } from '@types';
import { utils } from '@application';

export const userSelector =
  (userId: User['id']) =>
  (state: AppState): User =>
    utils.denormalize(userId, TYPE_USER, state.entities);
