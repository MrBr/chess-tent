import { ActivityModel, depopulate } from "./model";
import { Activity, User } from "@chess-tent/models";

export const saveActivity = (activity: Activity) =>
  new Promise(resolve => {
    ActivityModel.updateOne({ _id: activity.id }, depopulate(activity), {
      upsert: true
    }).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const getActivity = (
  activityId: Activity["id"]
): Promise<Activity | null> =>
  new Promise(resolve => {
    ActivityModel.findById(activityId)
      .populate("owner")
      .populate("users")
      .populate("subject")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject() : null);
      });
  });

export const findActivities = (
  activity: Partial<Activity>
): Promise<Activity[]> =>
  new Promise(resolve => {
    ActivityModel.find(ActivityModel.translateAliases(activity))
      .populate("owner")
      .populate("users")
      .populate("subject")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
      });
  });

export const canEditActivity = (
  activityId: Activity["id"],
  userId: User["id"]
) =>
  new Promise(resolve => {
    ActivityModel.findOne({
      _id: activityId
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve(
        !result ||
          result?.owner === userId ||
          result?.users.some(user => user === userId)
      );
    });
  });
