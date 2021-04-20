import { TYPE_LESSON_DETAILS } from './types';
import { Chapter } from '../chapter';
import { LessonDetails } from '../lessonDetails';

const isLessonDetails = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value ===
  TYPE_LESSON_DETAILS;

const createLessonDetails = (
  chapters: Chapter[],
  title: string,
  description?: string,
): LessonDetails => ({
  type: TYPE_LESSON_DETAILS,
  chapters,
  title,
  description,
});

export { isLessonDetails, createLessonDetails };
