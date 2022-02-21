import { Subject } from '../subject';
import { User } from '../user';
import { Activity, TYPE_ACTIVITY } from './types';

export const isActivity = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_ACTIVITY;

export const createActivity = <T extends Subject, K extends {}>(
  id: string,
  subject: T,
  owner: User,
  state: K,
  users: User[] = [],
): Activity<T, K> => ({
  id,
  type: TYPE_ACTIVITY,
  subject,
  owner,
  users,
  state,
});
