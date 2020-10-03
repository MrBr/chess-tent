import { hooks } from '@application';
import { Activity, User } from '@chess-tent/models';

export const useUserActivitiesRecord = (user: User) =>
  hooks.useRecord<Activity[]>(`${user.id}-activities`);
