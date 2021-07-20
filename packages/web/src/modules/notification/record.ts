import { records, requests } from '@application';
import { Notification, TYPE_NOTIFICATION } from '@chess-tent/models';

const activeUserNotifications = records.createRecord(
  records.withRecordBase<Notification[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_NOTIFICATION),
  records.withRecordApiLoad(requests.notifications),
);

export { activeUserNotifications };
