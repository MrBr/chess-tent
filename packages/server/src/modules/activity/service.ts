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
  const $set = service.subjectPathUpdatesToMongoose$set(updates);
  return new Promise(resolve => {
    ActivityModel.updateOne(
      { _id: activityId },
      { $set },
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
      .populate('owner')
      .populate('users')
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
    const owner = utils.notNullOrUndefined({
      owner: activityFilters.owner,
    });
    const users = utils.notNullOrUndefined({
      users: activityFilters.users,
    });

    const dotNotatedState = db.dotNotate({ state: activityFilters.state });

    const query: MongooseFilterQuery<any> = utils.notNullOrUndefined({
      ...dotNotatedState,
      subject: activityFilters.subject,
      ...db.orQueries(owner, users),
    });

    ActivityModel.find(query)
      .populate('owner')
      .populate('users')
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
      resolve(
        !result ||
          result?.owner === userId ||
          result?.users.some(user => user === userId),
      );
    });
  });
