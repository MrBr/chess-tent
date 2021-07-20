import { records, requests } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';

const activeUser = records.createRecord(
  records.withRecordBase<User>(),
  records.withRecordDenormalized(TYPE_USER),
  records.withRecordApiLoad(requests.me),
);

const user = records.createRecord(
  records.withRecordBase<User>(),
  records.withRecordDenormalized(TYPE_USER),
  records.withRecordApiLoad(requests.user),
);

export { activeUser, user };
