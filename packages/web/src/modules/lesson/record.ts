import { records, requests } from '@application';
import { LessonActivity, TYPE_LESSON } from '@chess-tent/models';
import {
  ActiveUserLessonsRecord,
  LessonRecord,
  LessonsRecord,
  StatusResponse,
  UserTrainingsRecord,
} from '@types';
import { MF } from '@chess-tent/redux-record/types';
import { RECORD_ACTIVE_USER_LESSONS_KEY } from './constants';

const newTraining: MF<(activity: LessonActivity) => Promise<void>> =
  () => () => record =>
    async function (activity: LessonActivity) {
      try {
        await requests.activitySave(activity);
        record.amend({ loading: true, loaded: false });
      } finally {
        record.push(activity);
        record.amend({ loading: false, loaded: true });
      }
    };
const userTrainings = records.createRecord<UserTrainingsRecord>({
  ...records.collectionRecipe,
  ...records.createApiRecipe(requests.trainings),
  new: newTraining,
});

const createLesson: MF<() => Promise<StatusResponse>, LessonRecord> =
  () => store => record => async () => {
    const lesson = record.get()?.value;
    if (!lesson) {
      throw new Error('Saving non-existing lesson');
    }

    const statusResponse = await requests.lessonSave(lesson);
    record.amend({ local: false });

    // Add lesson to user lessons if not there
    const myLessonsRecord = myLessons(RECORD_ACTIVE_USER_LESSONS_KEY)(store);
    const hasLesson = !!myLessonsRecord
      .get()
      ?.value?.some(({ id }) => lesson.id === id);

    if (!hasLesson) {
      myLessonsRecord.push(lesson);
    }

    return statusResponse;
  };
const lesson = records.createRecord<LessonRecord>({
  ...records.collectionRecipe,
  ...records.createDenormalizedRecipe(TYPE_LESSON),
  ...records.createApiRecipe(requests.lesson),
  create: createLesson,
});

// Do not normalize because those lessons have partial state
const myLessons = records.createRecord<ActiveUserLessonsRecord>({
  ...records.collectionRecipe,
  ...records.createApiRecipe(requests.myLessons),
});

// Do not normalize because those lessons have partial state
const lessons = records.createRecord<LessonsRecord>({
  ...records.collectionRecipe,
  ...records.createApiRecipe(requests.lessons),
});

export { userTrainings, lessons, myLessons, lesson };
