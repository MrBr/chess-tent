import { Subject } from '../subject';

export const TYPE_ACTIVITY = 'activities';

export interface Activity<
  T extends Subject = Subject,
  S extends { [key: string]: any } = any,
> {
  id: string;
  state: S;
  subject: T;
  // Shouldn't be required because it's more a db thing
  subjectType?: T['type'];
  type: typeof TYPE_ACTIVITY;
  date?: Date;
  weekly?: boolean;
  title?: string;
  completed?: boolean;
}

export interface NormalizedActivity<
  T extends Subject = Subject,
  S extends {} = {},
> {
  id: Activity<T>['id'];
  type: Activity<T>['type'];
  state: Activity<T, S>['state'];
  subject: Subject;
  subjectType: T['type'];
  date?: Date;
  weekly?: boolean;
  title?: string;
  completed?: boolean;
}
