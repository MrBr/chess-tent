import { records, requests } from '@application';
import {
  Lesson,
  LessonActivity,
  TYPE_ACTIVITY,
  TYPE_LESSON,
} from '@chess-tent/models';
import { RECORD_ACTIVE_USER_LESSONS_KEY } from './constants';

const userTrainings = records.createRecord(
  records.withRecordBase<LessonActivity[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_ACTIVITY),
  records.withRecordApiLoad(requests.trainings),
  records.withRecordMethod()(
    'new',
    () => () => record =>
      async function (activity: LessonActivity) {
        try {
          await requests.activitySave(activity);
          record.amend({ loading: true, loaded: false });
        } finally {
          record.push(activity);
          record.amend({ loading: false, loaded: true });
        }
      },
  ),
);

const lessons = records.createRecord(
  records.withRecordBase<Lesson[], {}>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_LESSON),
  records.withRecordApiLoad(requests.lessons),
);

const lesson = records.createRecord(
  records.withRecordBase<Lesson, { local?: boolean }>(),
  records.withRecordDenormalized(TYPE_LESSON),
  records.withRecordApiLoad(requests.lesson),
  records.withRecordMethod()('create', () => store => record => async () => {
    const lesson = record.get().value;
    if (!lesson) {
      throw new Error('Saving non-existing lesson');
    }

    const statusResponse = await requests.lessonSave(lesson);
    record.amend({ local: false });

    // Add lesson to user lessons if not there
    const myLessonsRecord = myLessons(RECORD_ACTIVE_USER_LESSONS_KEY)(store);
    const hasLesson = !!myLessonsRecord
      .get()
      .value?.some(({ id }) => lesson.id === id);

    if (!hasLesson) {
      myLessonsRecord.push(lesson);
    }

    return statusResponse;
  }),
);

const myLessons = records.createRecord(
  records.withRecordBase<Lesson[], {}>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_LESSON),
  records.withRecordApiLoad(requests.myLessons),
);

export { userTrainings, lessons, myLessons, lesson };
