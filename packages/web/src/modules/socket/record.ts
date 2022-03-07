import { records } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';

const roomUsers = records.createRecord(
  records.withRecordBase<User[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_USER),
);

export { roomUsers };
