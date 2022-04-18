import { Subject } from '../subject';
import { Activity, TYPE_ACTIVITY } from './types';

export const isActivity = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_ACTIVITY;

export const createActivity = <T extends Subject, K extends {}>(
  id: string,
  subject: T,
  roles: Activity['roles'],
  state: K,
  optionals?: Pick<Activity, 'date' | 'weekly' | 'title'>,
): Activity<T, K> => ({
  ...optionals,
  id,
  type: TYPE_ACTIVITY,
  subject,
  roles,
  state,
});
