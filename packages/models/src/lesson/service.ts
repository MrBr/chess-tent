import produce from 'immer';
import {
  Difficulty,
  Lesson,
  NormalizedLesson,
  LessonStateStatus,
  TYPE_LESSON,
} from './types';
import { User } from '../user';
import { Step } from '../step';
import { Chapter, updateChapterStep } from '../chapter';
import { Tag } from '../tag';
import { updateSubject } from '../subject';

const isLesson = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_LESSON;

const getLessonChapter = (lesson: Lesson, chapterId: Chapter['id']) => {
  for (const chapter of lesson.state.chapters) {
    if (chapter.id === chapterId) {
      return chapter;
    }
  }
  return null;
};

const addChapterToLesson = <T extends Lesson | NormalizedLesson>(
  lesson: T,
  chapter: Chapter,
): T =>
  produce(lesson, draft => {
    draft.state.chapters.push(chapter);
  });

const publishLesson = (lesson: Lesson | NormalizedLesson): typeof lesson =>
  produce(lesson, draft => {
    draft.state.status = LessonStateStatus.PUBLISHED;
    draft.published = true;
  });

const getLessonChapterIndex = (lesson: Lesson, chapterId: Chapter['id']) => {
  return lesson.state.chapters.findIndex(({ id }) => id === chapterId);
};

const updateLessonChapter = (lesson: Lesson, chapter: Chapter) =>
  produce(lesson, draft => {
    const chapterIndex = getLessonChapterIndex(lesson, chapter.id);
    draft.state.chapters[chapterIndex] = chapter;
  });
const updateLessonStep = (lesson: Lesson, chapter: Chapter, step: Step) =>
  produce(lesson, draft => {
    const chapterIndex = getLessonChapterIndex(lesson, chapter.id);
    draft.state.chapters[chapterIndex] = updateChapterStep(chapter, step);
  });

const updateLesson = (
  lesson: Lesson | NormalizedLesson,
  update: Partial<Lesson | NormalizedLesson>,
) => updateSubject(lesson, update);

const createLesson = (
  id: string,
  chapters: Chapter[],
  owner: User,
  title = 'Lesson',
  difficulty: Difficulty = Difficulty.BEGINNER,
  tags: Tag[] = [],
): Lesson => ({
  id,
  type: TYPE_LESSON,
  owner,
  difficulty,
  tags,
  state: { chapters, title },
});

export {
  isLesson,
  createLesson,
  getLessonChapter,
  addChapterToLesson,
  publishLesson,
  updateLessonChapter,
  updateLessonStep,
  getLessonChapterIndex,
  updateLesson,
};
