import {
  Lesson,
  LessonPath,
  LessonStepPath,
  NormalizedLesson,
  TYPE_LESSON
} from "./types";
import { User } from "../user";
import { Step } from "../step";
import {
  getChapterStepPath,
  updateChapterStep,
  Chapter,
  getChapterStepAt
} from "../chapter";

const isLesson = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_LESSON;

const getLessonChapter = (lesson: Lesson, chapterId: Chapter["id"]) => {
  for (const chapter of lesson.state.chapters) {
    if (chapter.id === chapterId) {
      return chapter;
    }
  }
  return null;
};

const addChapterToLesson = <T extends Lesson | NormalizedLesson>(
  lesson: T,
  chapter: Chapter
): T => ({
  ...lesson,
  state: {
    ...lesson.state,
    chapters: [...lesson.state.chapters, chapter]
  }
});

const getLessonChapterIndex = (lesson: Lesson, chapterId: Chapter["id"]) => {
  return lesson.state.chapters.findIndex(({ id }) => id === chapterId);
};

const getLessonChapterPath = (lesson: Lesson, chapterId: Chapter["id"]) => {
  return [getLessonChapterIndex(lesson, chapterId)];
};

const getLessonStepPath = (lesson: Lesson, chapter: Chapter, step: Step) => {
  for (let index = 0; index < lesson.state.chapters.length; index++) {
    const childChapter = lesson.state.chapters[index];
    if (childChapter.id === chapter.id) {
      const path = getChapterStepPath(chapter, step);
      path?.unshift(index);
      return path;
    }
  }
  return null;
};

const getLessonValueAt = (lesson: Lesson, path: LessonPath) => {
  const [rootPath, nextPath, ...nestedPath] = path;
  if (typeof rootPath === "string") {
    return lesson.state[rootPath as keyof Lesson["state"]];
  }
  const chapter = lesson.state.chapters[rootPath];
  if (!nextPath) {
    return chapter;
  }
  return getChapterStepAt(chapter, nestedPath as LessonStepPath);
};

const updateLessonStep = (
  lesson: Lesson,
  patch: Partial<Step>,
  path: number[]
) => {
  const [index, ...nestedPath] = path;
  const chapters = [...lesson.state.chapters];
  chapters[index] = updateChapterStep(chapters[index], patch, nestedPath);
  return {
    ...lesson,
    state: {
      ...lesson.state,
      chapters
    }
  };
};

const createLesson = (
  id: string,
  chapters: Chapter[],
  owner: User,
  title = "Lesson"
): Lesson => ({
  id,
  type: TYPE_LESSON,
  owner,
  state: { chapters, title }
});

export {
  isLesson,
  createLesson,
  getLessonChapter,
  addChapterToLesson,
  getLessonStepPath,
  updateLessonStep,
  getLessonValueAt,
  getLessonChapterIndex,
  getLessonChapterPath
};
