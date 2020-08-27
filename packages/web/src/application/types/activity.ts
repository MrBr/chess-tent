import { Activity, Lesson, Step } from '@chess-tent/models';

export type LessonActivity = Activity<
  Lesson,
  {
    activeStepId: Step['id'];
    [key: string]: {};
  }
>;
