import { records, requests } from '@application';
import { Tag, TYPE_TAG } from '@chess-tent/models';

const tags = records.createRecord(
  records.withRecordBase<Tag[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_TAG),
  records.withRecordApiLoad(requests.tags),
);

export { tags };
