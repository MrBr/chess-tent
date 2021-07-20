import { records } from '@application';
import { Activity, TYPE_ACTIVITY } from '@chess-tent/models';

const activity = records.createRecord(
  records.withRecordBase<Activity>(),
  records.withRecordDenormalized(TYPE_ACTIVITY),
);

export { activity };
