import { records, requests } from '@application';
import { Tag, TYPE_ACTIVITY } from '@chess-tent/models';

const tags = records.createRecord(
  records.withRecordBase<Tag[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_ACTIVITY),
  records.withRecordApiLoad(requests.tags),
);

export { tags };
