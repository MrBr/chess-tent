import { Schema } from 'mongoose';
import {
  Activity,
  NormalizedActivity,
  TYPE_ACTIVITY,
} from '@chess-tent/models';
import { db } from '@application';
import { activityAdapter } from './adapter';

export interface DepupulatedActivity {
  id: Activity['id'];
  type: Activity['type'];
  state: Activity['state'];
  subject: Activity['subject'];
  subjectType: Activity['subjectType'];
  roles: NormalizedActivity['roles'];
  date?: NormalizedActivity['date'];
  weekly?: NormalizedActivity['weekly'];
  title?: NormalizedActivity['title'];
  completed?: NormalizedActivity['completed'];
  v?: number;
}

const activitySchema = db.createSchema<DepupulatedActivity>(
  {
    subject: {
      type: Schema.Types.Mixed,
    } as unknown as DepupulatedActivity['subject'],
    title: {
      type: Schema.Types.Mixed,
    } as unknown as DepupulatedActivity['title'],
    subjectType: {
      type: String,
    } as unknown as DepupulatedActivity['subjectType'],
    roles: [db.roleSchema] as unknown as DepupulatedActivity['roles'],
    state: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    } as unknown as DepupulatedActivity['state'],
    type: {
      type: String,
      default: TYPE_ACTIVITY,
    } as unknown as typeof TYPE_ACTIVITY,
    date: {
      type: Schema.Types.Date,
    } as unknown as Date,
    weekly: {
      type: Schema.Types.Boolean,
    } as unknown as boolean,
    completed: {
      type: Schema.Types.Boolean,
    } as unknown as boolean,
    v: {
      type: Schema.Types.Number,
      default: 1,
    } as unknown as number,
  },
  { minimize: false },
);

db.applyAdapter(activitySchema, activityAdapter);

const ActivityModel = db.createModel<DepupulatedActivity>(
  TYPE_ACTIVITY,
  activitySchema,
);

const depopulate = <T extends Activity | Partial<Activity>>(
  activity: T,
): T extends Activity ? DepupulatedActivity : Partial<DepupulatedActivity> => {
  const depopulatedActivity = {} as T extends Activity
    ? DepupulatedActivity
    : Partial<DepupulatedActivity>;
  if (activity.roles) {
    depopulatedActivity.roles = activity.roles.map(db.depopulateRole);
  }

  if (activity.subject?.type) {
    depopulatedActivity.subjectType = activity.subject.type;
  }

  return { ...activity, ...depopulatedActivity };
};

export { activitySchema, ActivityModel, depopulate };
