import { Subject } from '../subject';
import { Activity, TYPE_ACTIVITY } from './types';
import { User } from '../user';

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

export const getActivityUserRole = <T extends Activity>(
  activity: T,
  user: User,
) => activity.roles.find(role => role.user.id === user.id);

export const getActivityNextDate = <T extends Activity>(activity: T) => {
  if (!activity.date) {
    return null;
  }
  const firstDate = new Date(activity.date);
  const now = new Date();

  if (activity.weekly && firstDate < now) {
    const daysToTraining = firstDate.getDay() - now.getDay();
    firstDate.setDate(
      now.getDate() +
        (daysToTraining < 0 ? 7 + daysToTraining : daysToTraining),
    );
  }

  return firstDate;
};
