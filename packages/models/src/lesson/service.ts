import { Lesson, TYPE_LESSON } from "./types";
import { User } from "../user";
import { Chapter } from "../chapter/types";
import { getStepAt, Step } from "../step";
import { getChapterStepPath, updateChapterStep } from "../chapter";

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

const getLessonStepAt = (lesson: Lesson, path: number[]) => {
  const [index, rootStepIndex, ...nestedPath] = path;
  const parentStep = lesson.state.chapters[index].state.steps[rootStepIndex];
  return nestedPath.length > 0 ? getStepAt(parentStep, nestedPath) : parentStep;
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
  owner: User
): Lesson => ({
  id,
  type: TYPE_LESSON,
  owner,
  state: { chapters }
});

export {
  isLesson,
  createLesson,
  getLessonChapter,
  getLessonStepPath,
  updateLessonStep,
  getLessonStepAt
};
