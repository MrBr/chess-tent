import { records, requests } from '@application';
import {
  Lesson,
  LessonActivity,
  TYPE_ACTIVITY,
  TYPE_LESSON,
} from '@chess-tent/models';

const userTrainings = records.createRecord(
  records.withRecordBase<LessonActivity[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_ACTIVITY),
  records.withRecordApiLoad(requests.trainings),
);

const lessons = records.createRecord(
  records.withRecordBase<Lesson[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_LESSON),
  records.withRecordApiLoad(requests.lessons),
);

const lesson = records.createRecord(
  records.withRecordBase<Lesson>(),
  records.withRecordDenormalized(TYPE_LESSON),
  records.withRecordApiLoad(requests.lesson),
);

const myLessons = records.createRecord(
  records.withRecordBase<Lesson[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_LESSON),
  records.withRecordApiLoad(requests.myLessons),
);

export { userTrainings, lessons, myLessons, lesson };
