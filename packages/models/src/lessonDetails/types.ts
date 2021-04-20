import { Chapter } from '../chapter';
import { Lesson } from '../lesson';

export const TYPE_LESSON_DETAILS = 'lessonDetails';

export interface LessonDetails {
  type: typeof TYPE_LESSON_DETAILS;
  chapters: Chapter[];
  title: string;
  description?: string;
}

export interface NormalizedLessonDetails {
  type: LessonDetails['type'];
  chapters: Chapter[];
  title: Lesson['state']['title'];
  description?: Lesson['state']['description'];
}
