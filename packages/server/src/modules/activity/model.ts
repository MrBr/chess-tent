import { Schema } from 'mongoose';
import {
  Activity,
  NormalizedActivity,
  Subject,
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
}

const activitySchema = db.createSchema<DepupulatedActivity>(
  {
    subject: ({
      type: Schema.Types.Mixed,
    } as unknown) as DepupulatedActivity['subject'],
    subjectType: ({
      type: String,
    } as unknown) as DepupulatedActivity['subjectType'],
    roles: ([db.roleSchema] as unknown) as DepupulatedActivity['roles'],
    state: ({
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    } as unknown) as DepupulatedActivity['state'],
    type: ({
      type: String,
      default: TYPE_ACTIVITY,
    } as unknown) as typeof TYPE_ACTIVITY,
  },
  { minimize: false },
);

db.applyAdapter(activitySchema, activityAdapter);

const ActivityModel = db.createModel<DepupulatedActivity>(
  TYPE_ACTIVITY,
  activitySchema,
);

const depopulate = (activity: Activity<Subject>): DepupulatedActivity => {
  const roles = activity.roles.map(db.depopulateRole);

  return {
    ...activity,
    roles,
    subjectType: activity.subject.type,
  };
};

export { activitySchema, ActivityModel, depopulate };
