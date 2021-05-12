import produce, { PatchListener } from 'immer';
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
import { createService } from '../_helpers';

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

const getLessonChapterIndex = (
  lesson: Lesson | NormalizedLesson,
  chapterId: Chapter['id'],
) => {
  return lesson.state.chapters.findIndex(({ id }) => id === chapterId);
};

const addChapterToLesson = createService(
  <T extends Lesson | NormalizedLesson>(draft: T, chapter: Chapter): T => {
    draft.state.chapters.push(chapter);
    return draft;
  },
);

const publishLesson = createService(
  <T extends Lesson | NormalizedLesson>(draft: T): T => {
    draft.state.status = LessonStateStatus.PUBLISHED;
    draft.published = true;
    return draft;
  },
);

const updateLessonChapter = createService(
  <T extends Lesson | NormalizedLesson>(draft: T, chapter: Chapter): T => {
    const chapterIndex = getLessonChapterIndex(draft, chapter.id);
    draft.state.chapters[chapterIndex] = chapter;
    return draft;
  },
);

const updateLessonStep = createService(
  <T extends Lesson | NormalizedLesson>(
    draft: T,
    chapter: Chapter,
    step: Step,
  ): T => {
    const chapterIndex = getLessonChapterIndex(draft, chapter.id);
    draft.state.chapters[chapterIndex] = updateChapterStep(chapter, step);
    return draft;
  },
);

const updateLesson = (
  lesson: Lesson | NormalizedLesson,
  update: Partial<Lesson | NormalizedLesson>,
  patchListener?: PatchListener,
) => updateSubject(lesson, update, patchListener);

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
