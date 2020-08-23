import { denormalize } from 'normalizr';
import { User } from '@chess-tent/models';
import { AppState } from '@types';
import { model } from '@application';

export const userSelector = (userId: User['id']) => (state: AppState): User =>
  denormalize(userId, model.userSchema, state.entities);
