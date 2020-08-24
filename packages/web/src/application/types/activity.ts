import { Activity, Lesson, Step } from '@chess-tent/models';

export type LessonActivity = Activity<
  Lesson,
  {
    activeStep: Step;
    [key: string]: {};
  }
>;
