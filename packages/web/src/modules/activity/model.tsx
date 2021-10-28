import { TYPE_ACTIVITY, TYPE_USER } from '@chess-tent/models';

export const activitySchema = {
  type: TYPE_ACTIVITY,
  relationships: {
    owner: TYPE_USER,
    users: TYPE_USER,
  },
};
