import { db } from '@application';
import { User, Notification, TYPE_USER } from '@chess-tent/models';
import { UpdateNotificationsRequest } from '@chess-tent/types';
import { depopulate, NotificationModel } from './model';

const NOTIFICATIONS_BUCKET_LIMIT = 1;

export const getNotifications = (filters: {
  user?: User['id'];
  read?: boolean;
}): Promise<Notification[]> =>
  new Promise(resolve => {
    NotificationModel.find({
      user: filters.user,
    })
      .populate('user')
      .populate({
        path: 'notifications.user',
        model: TYPE_USER,
      })
      .limit(2)
      .then(notifications => {
        console.log('getNotifications filters', filters);
        console.log('getNotifications notifications', notifications);
        const result = db.flattenBuckets(notifications, 'notifications');
        console.log('getNotifications result', result);
        const filteredResult = result.filter(
          (item: Notification) => item.read === filters.read,
        );
        console.log('getNotifications filteredResult', filteredResult);
        resolve(filteredResult);
      })
      .catch(err => {
        throw err;
      });
  });

export const saveNotification = (notification: Notification) =>
  new Promise<void>(resolve => {
    const userId = notification.user.id;
    const idRegex = db.getBucketingIdFilterRegex(userId);
    NotificationModel.updateOne(
      {
        _id: idRegex,
        count: { $lt: NOTIFICATIONS_BUCKET_LIMIT },
      },
      {
        $push: {
          notifications: {
            $each: [depopulate(notification)],
            $position: 0,
          },
        },
        $inc: { count: 1 },
        $set: { user: userId },
        $setOnInsert: {
          _id: `${userId}_${notification.timestamp}`,
        },
      },
      { upsert: true },
    ).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const updateNotifications = (
  filter: { user: User['id']; _id: UpdateNotificationsRequest['ids'] },
  $set: UpdateNotificationsRequest['updates'],
) => {
  return new Promise<void>(resolve => {
    console.log('updateNotifications filter', filter);
    console.log('updateNotifications $set', $set);
    const setPrefix = 'notifications.$[elem]';
    // Transform to MongoDB format for array elem update
    // More info: https://docs.mongodb.com/manual/reference/operator/update/positional-filtered/#examples
    const newSet: Record<string, any> = {};
    Object.entries($set).forEach(
      ([key, value]) => (newSet[`${setPrefix}.${key}`] = value),
    );
    console.log('updateNotifications newSet', newSet);
    NotificationModel.updateMany(
      { user: filter.user },
      { $set: newSet },
      // { $set: { 'notifications.$[elem].seen': true } },
      {
        multi: true,
        arrayFilters: [{ 'elem.id': { $in: filter._id } }],
      },
    ).exec(err => {
      if (err) {
        throw err;
      }
    });
    resolve();
  });
};
