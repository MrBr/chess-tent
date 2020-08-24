import { model, Schema, Document } from "mongoose";
import {
  Activity,
  NormalizedActivity,
  Subject,
  TYPE_ACTIVITY,
  TYPE_USER
} from "@chess-tent/models";
import { db } from "@application";

export interface DepupulatedActivity {
  id: Activity["id"];
  type: Activity["type"];
  state: Activity["state"];
  subject: NormalizedActivity["subject"];
  owner: NormalizedActivity["owner"];
  users: NormalizedActivity["users"];
}

export type ActivityDocument = DepupulatedActivity & Document;

const activitySchema = db.createStandardSchema<DepupulatedActivity>({
  subject: ({
    type: Schema.Types.Mixed,
    ref: TYPE_USER
  } as unknown) as DepupulatedActivity["subject"],
  owner: ({
    type: String,
    ref: TYPE_USER
  } as unknown) as DepupulatedActivity["owner"],
  users: [
    {
      type: String,
      ref: TYPE_USER
    } as unknown
  ] as DepupulatedActivity["users"],
  state: ({
    type: Schema.Types.Mixed,
    required: true
  } as unknown) as DepupulatedActivity["state"],
  type: ({
    type: String,
    default: TYPE_ACTIVITY
  } as unknown) as typeof TYPE_ACTIVITY
});

const ActivityModel = model<ActivityDocument>(TYPE_ACTIVITY, activitySchema);

const depopulate = (activity: Activity<Subject>): DepupulatedActivity => {
  const users = activity.users.map(user => user.id);
  return { ...activity, owner: activity.owner.id, users };
};

export { activitySchema, ActivityModel, depopulate };
