import { Difficulty, Lesson, NormalizedLesson, TYPE_LESSON } from './types';
import { User } from '../user';
import { getStepPath, Step } from '../step';
import { Chapter } from '../chapter';
import {
  createLessonDetails,
  LessonDetails,
  NormalizedLessonDetails,
} from '../lessonDetails';
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

const addLessonDetailsToLessonVersions = <T extends Lesson | NormalizedLesson>(
  lesson: T,
  lessonDetails: LessonDetails | NormalizedLessonDetails,
): T => ({
  ...lesson,
  versions: [...lesson.versions, lessonDetails],
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
  versions: LessonDetails[] = [],
): Lesson => ({
  id,
  type: TYPE_LESSON,
  owner,
  difficulty,
  tags,
  state: createLessonDetails(chapters, title),
  versions,
});

export {
  isLesson,
  createLesson,
  getLessonChapter,
  addChapterToLesson,
  addLessonDetailsToLessonVersions,
  getLessonStepPath,
  updateLessonStep,
  getLessonChapterIndex,
  getLessonChapterPath,
  getLessonStatePath,
};
