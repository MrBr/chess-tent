import { Schema } from 'mongoose';
import {
  Activity,
  NormalizedActivity,
  Subject,
  TYPE_ACTIVITY,
  TYPE_USER,
} from '@chess-tent/models';
import { db } from '@application';

export interface DepupulatedActivity {
  id: Activity['id'];
  type: Activity['type'];
  state: Activity['state'];
  subject: NormalizedActivity['subject'];
  subjectType: NormalizedActivity['subject']['type'];
  owner: NormalizedActivity['owner'];
  users: NormalizedActivity['users'];
}

const activitySchema = db.createSchema<DepupulatedActivity>(
  {
    subject: ({
      type: Schema.Types.Mixed,
    } as unknown) as DepupulatedActivity['subject'],
    subjectType: ({
      type: String,
    } as unknown) as DepupulatedActivity['subjectType'],
    owner: ({
      type: String,
      ref: TYPE_USER,
    } as unknown) as DepupulatedActivity['owner'],
    users: [
      {
        type: String,
        ref: TYPE_USER,
      } as unknown,
    ] as DepupulatedActivity['users'],
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

const ActivityModel = db.createModel<DepupulatedActivity>(
  TYPE_ACTIVITY,
  activitySchema,
);

const depopulate = (activity: Activity<Subject>): DepupulatedActivity => {
  const users = activity.users.map(user => user.id);
  return {
    ...activity,
    owner: activity.owner.id,
    users,
    subjectType: activity.subject.type,
  };
};

export { activitySchema, ActivityModel, depopulate };
