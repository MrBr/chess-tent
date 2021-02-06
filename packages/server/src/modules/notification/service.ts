import { User, Notification } from '@chess-tent/models';
import { depopulate, NotificationModel } from './model';

export const getNotifications = (filters: {
  user?: User['id'];
  read?: boolean;
}): Promise<Notification[]> =>
  new Promise(resolve => {
    NotificationModel.find(filters)
      .populate('user')
      .then(notifications => {
        resolve(notifications.map(notification => notification.toObject()));
      })
      .catch(err => {
        throw err;
      });
  });

export const saveNotification = (notification: Notification) =>
  new Promise(resolve => {
    NotificationModel.updateOne(
      { _id: notification.id },
      depopulate(notification),
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

export const updateNotifications = ({
  ids,
  updates,
}: {
  ids: Notification['id'][];
  updates: {};
}) => {
  console.log({ ids }, { updates });
  return new Promise(resolve =>
    NotificationModel.updateMany(
      {
        _id: ids,
      },
      {
        $set: updates,
      },
    ).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    }),
  );
};
