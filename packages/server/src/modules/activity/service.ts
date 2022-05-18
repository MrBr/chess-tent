import { FilterQuery } from 'mongoose';
import { AppDocument } from '@types';
import { service, db, utils } from '@application';
import { Activity, SubjectPathUpdate, User } from '@chess-tent/models';
import { ActivityFilters } from '@chess-tent/types';
import { ActivityModel, depopulate, DepupulatedActivity } from './model';

export const saveActivity = (activity: Activity) =>
  new Promise<void>(resolve => {
    ActivityModel.updateOne({ _id: activity.id }, depopulate(activity), {
      upsert: true,
    }).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const patchActivity = (
  activityId: Activity['id'],
  patch: Partial<Activity>,
) =>
  new Promise<void>(resolve => {
    ActivityModel.updateOne({ _id: activityId }, { $set: patch }).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const updateActivity = (
  activityId: Activity['id'],
  updates: SubjectPathUpdate[],
) => {
  const { $set, $unset } = service.subjectPathUpdatesToMongoose(updates);
  return new Promise<void>(resolve => {
    ActivityModel.updateOne(
      { _id: activityId },
      { $set, $unset },
      {
        upsert: true,
      },
    ).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};

export const getActivity = (
  activityId: Activity['id'],
): Promise<Activity | null> =>
  new Promise<Activity | null>(resolve => {
    ActivityModel.findById(activityId)
      .populate('roles.user')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject<Activity>() : null);
      });
  });

export const deleteActivity = async (activityId: Activity['id']) => {
  await ActivityModel.deleteOne({ _id: activityId });
};

export const findActivities = (
  activityFilters: ActivityFilters,
): Promise<Activity[]> =>
  new Promise(resolve => {
    // TODO - subjectType
    const roles = utils.notNullOrUndefined({
      'roles.user': { $in: activityFilters.users },
    });

    // In short
    // Query by the date range or check if the date exists
    // If queried by the date range then additionally check for the weekly activity because they eventually occur again
    const date = utils.notNullOrUndefined({
      ...db.orQueries(
        {
          date:
            typeof activityFilters.date === 'object' &&
            Object.keys(activityFilters.date).length > 0
              ? db.getDateRangeFilter(activityFilters.date)
              : typeof activityFilters.date === 'boolean'
              ? { $exists: activityFilters.date }
              : undefined,
        },
        {
          weekly:
            typeof activityFilters.date === 'object' &&
            Object.keys(activityFilters.date).length > 0,
        },
      ),
    });

    const query: FilterQuery<AppDocument<DepupulatedActivity>> =
      utils.notNullOrUndefined({
        completed: !activityFilters.completed
          ? { $in: [undefined, false] }
          : { $eq: true },
        subject: activityFilters.subject
          ? { $eq: activityFilters.subject as unknown as Activity['subject'] } // TODO - verify activity model
          : undefined,
        ...roles,
        ...date,
      });

    ActivityModel.find(query)
      .populate('roles.user')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject<Activity>()));
      });
  });

export const canEditActivity = (
  activityId: Activity['id'],
  userId: User['id'],
) =>
  new Promise(resolve => {
    ActivityModel.findOne({
      _id: activityId,
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve(!result || result?.roles.some(({ user }) => user === userId));
    });
  });
