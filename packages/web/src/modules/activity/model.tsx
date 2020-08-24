import { TYPE_ACTIVITY } from '@chess-tent/models';
import { schema } from 'normalizr';
import { model } from '@application';

export const activitySchema = new schema.Entity(TYPE_ACTIVITY, {
  owner: model.userSchema,
  users: [model.userSchema],
});
