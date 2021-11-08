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

const unpublishLesson = createService(
  <T extends Lesson | NormalizedLesson>(draft: T): T => {
    draft.state.status = LessonStateStatus.DRAFT;
    draft.published = false;
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

const canEditLesson = (lesson: Lesson, userId: User['id']) =>
  lesson.owner.id === userId || lesson.users?.some(({ id }) => id === userId);

/**
 * Draft lesson is editable version of the lesson unlike public document version.
 */
const isLessonDraft = (lesson: Lesson) => !lesson.docId;

/**
 * Public copy of the lesson, accessible by non collaborators.
 */
const isLessonPublicDocument = (lesson: Lesson) => !!lesson.docId;

const canAccessLesson = (lesson: Lesson, userId: User['id']) =>
  canEditLesson(lesson, userId) || isLessonPublicDocument(lesson);

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
  unpublishLesson,
  updateLessonChapter,
  updateLessonStep,
  getLessonChapterIndex,
  updateLesson,
  canEditLesson,
  canAccessLesson,
  isLessonDraft,
  isLessonPublicDocument,
};
