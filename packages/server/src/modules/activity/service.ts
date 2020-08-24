import { ActivityModel, depopulate } from "./model";
import { Activity } from "@chess-tent/models";

export const saveActivity = (activity: Activity) =>
  new Promise((resolve, reject) => {
    ActivityModel.updateOne({ _id: activity.id }, depopulate(activity), {
      upsert: true
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const getActivity = (
  activityId: Activity["id"]
): Promise<Activity | null> =>
  new Promise((resolve, reject) => {
    ActivityModel.findById(activityId)
      .populate("owner")
      .populate("users")
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
  new Promise((resolve, reject) => {
    ActivityModel.find(ActivityModel.translateAliases(activity))
      .populate("owner")
      .populate("users")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
      });
  });
