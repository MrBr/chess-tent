import { Chapter, TYPE_CHAPTER } from "./types";
import {
  getChildStep,
  getLastStep,
  getNextStep,
  getParentStep,
  getPreviousStep,
  getRightStep,
  getStepAt,
  getStepIndex,
  getStepPath,
  getStepsCount,
  getStepSequence,
  isSameStep,
  Step
} from "../step";
import { SubjectPath, updateSubjectValueAt } from "../subject";

const isChapter = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_CHAPTER;

const getChapterStep = (chapter: Chapter, stepId: Step["id"]) => {
  for (const rootStep of chapter.state.steps) {
    const step = getChildStep(rootStep, stepId);
    if (step) {
      return step;
    }
  }
  return null;
};

const getChapterParentStep = (chapter: Chapter, step: Step) => {
  for (const rootStep of chapter.state.steps) {
    if (isSameStep(rootStep, step)) {
      return null;
    }
    const parentStep = getParentStep(rootStep, step);
    if (parentStep) {
      return parentStep;
    }
  }
};

const getChapterPreviousStep = (chapter: Chapter, step: Step) => {
  let index = 0;
  for (const rootStep of chapter.state.steps) {
    const rootStep = chapter.state.steps[index];
    if (isSameStep(rootStep, step)) {
      return index > 0 ? getLastStep(chapter.state.steps[index - 1]) : null;
    }
    const previousStep = getPreviousStep(rootStep, step);
    if (previousStep) {
      return previousStep;
    }
    index++;
  }
};

const getChapterNextStep = (chapter: Chapter, step: Step) => {
  let index = 0;
  while (index < chapter.state.steps.length) {
    const rootStep = chapter.state.steps[index];
    if (isSameStep(rootStep, step)) {
      return (
        getNextStep(rootStep, step) || chapter.state.steps[index + 1] || null
      );
    }
    const nextStep = getNextStep(rootStep, step);
    if (nextStep) {
      return nextStep;
    }
    index++;
  }
};

const getChapterRightStep = (chapter: Chapter, step: Step): Step | null => {
  let index = 0;
  while (index < chapter.state.steps.length) {
    const rootStep = chapter.state.steps[index];
    if (isSameStep(rootStep, step)) {
      return chapter.state.steps[index + 1] || null;
    }
    const nextStep = getRightStep(rootStep, step);
    if (nextStep) {
      return nextStep;
    }
    index++;
  }
  return null;
};

const getChapterStepsCount = (chapter: Chapter) => {
  let count = 0;
  chapter.state.steps.forEach(step => {
    count += getStepsCount(step);
  });
  return count;
};

const getChapterStepIndex = (chapter: Chapter, step: Step) => {
  let index = 0;
  chapter.state.steps.forEach(parentStep => {
    index += getStepIndex(parentStep, step);
  });
  return index;
};

const getChapterStepPath = (chapter: Chapter, step: Step) => {
  for (let index = 0; index < chapter.state.steps.length; index++) {
    const childStep = chapter.state.steps[index];
    if (isSameStep(childStep, step)) {
      return ["state", "steps", index];
    }
    const path = getStepPath(childStep, step);
    if (path) {
      return ["state", "steps", index, ...path];
    }
  }
  return null;
};

const getChapterStepSequence = (chapter: Chapter, step: Step) => {
  for (let index = 0; index < chapter.state.steps.length; index++) {
    const childStep = chapter.state.steps[index];
    if (isSameStep(childStep, step)) {
      return [childStep];
    }
    const path = getStepSequence(childStep, step);
    if (path) {
      return [childStep, ...path];
    }
  }
  return null;
};

const getChapterStepAt = (chapter: Chapter, stepPath: number[]) => {
  const [rootStepIndex, ...nestedPath] = stepPath;
  const parentStep = chapter.state.steps[rootStepIndex];
  return nestedPath.length > 0 ? getStepAt(parentStep, nestedPath) : parentStep;
};

const updateChapterStep = (
  chapter: Chapter,
  patch: Partial<Step>,
  path: SubjectPath
) => updateSubjectValueAt(chapter, path, patch);

const createChapter = (
  id: string,
  title = "Chapter",
  steps: Step[]
): Chapter => ({
  id,
  type: TYPE_CHAPTER,
  state: { steps, title }
});

export {
  getChapterParentStep,
  getChapterPreviousStep,
  getChapterNextStep,
  getChapterRightStep,
  getChapterStepsCount,
  getChapterStepIndex,
  getChapterStep,
  isChapter,
  getChapterStepPath,
  getChapterStepSequence,
  createChapter,
  updateChapterStep,
  getChapterStepAt
};
