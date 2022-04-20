import { MongooseFilterQuery } from 'mongoose';
import { service, db, utils } from '@application';
import { Activity, SubjectPathUpdate, User } from '@chess-tent/models';
import { ActivityFilters } from '@chess-tent/types';
import { ActivityModel, depopulate } from './model';

export const saveActivity = (activity: Activity) =>
  new Promise(resolve => {
    ActivityModel.updateOne({ _id: activity.id }, depopulate(activity), {
      upsert: true,
    }).exec(err => {
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
  return new Promise(resolve => {
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
  new Promise(resolve => {
    ActivityModel.findById(activityId)
      .populate('roles.user')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject() : null);
      });
  });

export const findActivities = (
  activityFilters: ActivityFilters,
): Promise<Activity[]> =>
  new Promise(resolve => {
    // TODO - subjectType
    const users = utils.notNullOrUndefined({
      'roles.user': activityFilters.users,
    });

    const date = utils.notNullOrUndefined({
      date:
        activityFilters.date && Object.keys(activityFilters.date).length > 0
          ? db.getDateRangeFilter(activityFilters.date)
          : undefined,
      weekly: activityFilters.weekly,
    });

    const query: MongooseFilterQuery<any> = utils.notNullOrUndefined({
      subject: activityFilters.subject,
      ...db.orQueries(users),
      ...date,
    });

    ActivityModel.find(query)
      .populate('roles.user')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
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
