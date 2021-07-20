import { records, requests } from '@application';
import { Mentorship, TYPE_MENTORSHIP } from '@chess-tent/models';

const students = records.createRecord(
  records.withRecordBase<Mentorship[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_MENTORSHIP),
  records.withRecordApiLoad(requests.students),
);

const coaches = records.createRecord(
  records.withRecordBase<Mentorship[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_MENTORSHIP),
  records.withRecordApiLoad(requests.coaches),
);

export { students, coaches };
