import { isEmpty } from 'lodash';
import {
  Difficulty,
  Lesson,
  NormalizedLesson,
  LessonState,
  LessonStateStatus,
  NormalizedLessonState,
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

const publishLesson = <T extends Lesson | NormalizedLesson>(
  lesson: T,
  lessonState: LessonState | NormalizedLessonState,
): T => ({
  ...lesson,
  versions: [...lesson.versions, lessonState],
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

const getNewestLessonVersion = (lesson: Lesson): number | null => {
  const versions = lesson?.versions;
  if (!isEmpty(versions)) {
    return versions.length - 1;
  }
  return null;
};

const getLessonWithVersionBase = (lesson: Lesson, version: number): Lesson => {
  return { ...lesson, state: lesson.versions[version] };
};

const getLessonWithNewestVersion = (lesson: Lesson): Lesson => {
  const newestVersion = getNewestLessonVersion(lesson);
  if (newestVersion === null) {
    return lesson;
  }
  return getLessonWithVersionBase(lesson, newestVersion);
};

const getLessonWithVersion = (lesson: Lesson, version: number): Lesson => {
  const versions = lesson?.versions;
  const hasVersionIndex = !(typeof versions[version] === 'undefined');

  if (!hasVersionIndex) {
    return getLessonWithNewestVersion(lesson);
  }

  return getLessonWithVersionBase(lesson, version);
};

const updateLessonStep = (
  lesson: Lesson,
  patch: Partial<Step>,
  path: SubjectPath,
) => updateSubjectValueAt(lesson, path, patch);

const updateLessonStatus = (
  lesson: Lesson,
  patch: LessonStateStatus,
  path: SubjectPath,
) => updateSubjectValueAt(lesson, path, patch);

const createLesson = (
  id: string,
  chapters: Chapter[],
  owner: User,
  title = 'Lesson',
  difficulty: Difficulty = Difficulty.BEGINNER,
  tags: Tag[] = [],
  versions: LessonState[] = [],
): Lesson => ({
  id,
  type: TYPE_LESSON,
  owner,
  difficulty,
  tags,
  state: { chapters, title },
  versions,
});

export {
  isLesson,
  createLesson,
  getLessonChapter,
  addChapterToLesson,
  publishLesson,
  getLessonStepPath,
  updateLessonStep,
  updateLessonStatus,
  getLessonChapterIndex,
  getLessonChapterPath,
  getLessonStatePath,
  getLessonWithVersion,
  getLessonWithNewestVersion,
  getNewestLessonVersion,
};
