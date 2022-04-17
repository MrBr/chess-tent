import { User } from '@chess-tent/models';

import { importWebModule } from '../utils';

export const trainingLoader = async () => {
  const lessonServices = await importWebModule(
    () => import('@chess-tent/web/src/modules/lesson/service'),
  );
  const lesson = lessonServices.createNewLesson({} as User);
  return {
    training: lessonServices.createLessonActivity(lesson, {} as User, {}),
  };
};
