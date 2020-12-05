import { hooks } from '@application';
import { Activity, TYPE_ACTIVITY, User } from '@chess-tent/models';

export const useUserActivitiesRecord = (user: User) =>
  hooks.useRecord<Activity[]>(`${user.id}-activities`, TYPE_ACTIVITY);
