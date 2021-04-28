import {
  Difficulty,
  Lesson,
  NormalizedLesson,
  LessonStateStatus,
  TYPE_LESSON,
} from './types';
import { User } from '../user';
import { getStepPath, Step } from '../step';
import { Chapter } from '../chapter';
import { SubjectPath, updateSubjectValueAt } from '../subject';
import { Tag } from '../tag';

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
): T => ({
  ...lesson,
  state: {
    ...lesson.state,
    chapters: [...lesson.state.chapters, chapter],
  },
});

const publishLesson = <T extends Lesson | NormalizedLesson>(lesson: T): T => ({
  ...lesson,
  state: { ...lesson.state, status: LessonStateStatus.PUBLISHED },
  isPublished: true,
});

const getLessonChapterIndex = (lesson: Lesson, chapterId: Chapter['id']) => {
  return lesson.state.chapters.findIndex(({ id }) => id === chapterId);
};

const getLessonStatePath = (stateKey: keyof Lesson['state']): SubjectPath => {
  return ['state', stateKey];
};

const getLessonChapterPath = (
  lesson: Lesson,
  chapterId: Chapter['id'],
): SubjectPath => {
  return ['state', 'chapters', getLessonChapterIndex(lesson, chapterId)];
};

const getLessonStepPath = (
  lesson: Lesson,
  chapter: Chapter,
  step: Step,
): SubjectPath | null => {
  for (let index = 0; index < lesson.state.chapters.length; index++) {
    const childChapter = lesson.state.chapters[index];
    if (childChapter.id === chapter.id) {
      const path = getStepPath(chapter, step);
      return path ? ['state', 'chapters', index, ...path] : null;
    }
  }
  return null;
};

const updateLessonStep = (
  lesson: Lesson,
  patch: Partial<Step>,
  path: SubjectPath,
) => updateSubjectValueAt(lesson, path, patch);

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
  getLessonStepPath,
  updateLessonStep,
  getLessonChapterIndex,
  getLessonChapterPath,
  getLessonStatePath,
};
