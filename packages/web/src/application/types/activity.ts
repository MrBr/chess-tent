import { Activity, Chapter, Lesson, Step } from '@chess-tent/models';

export type LessonActivity = Activity<
  Lesson,
  {
    activeChapterId?: Chapter['id'];
    activeStepId?: Step['id'];
    training: boolean;
    [key: string]: any;
  }
>;
