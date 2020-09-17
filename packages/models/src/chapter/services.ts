import { Chapter, TYPE_CHAPTER } from "./types";
import {
  getChildStep,
  getLastStep,
  getNextStep,
  getParentStep,
  getPreviousStep,
  getStepIndex,
  getStepPath,
  getStepsCount,
  isSameStep,
  Step,
  updateNestedStep,
  updateStep
} from "../step";

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
      return [index];
    }
    const path = getStepPath(childStep, step);
    if (path) {
      path.unshift(index);
      return path;
    }
  }
  return null;
};

const updateChapterStep = (
  chapter: Chapter,
  patch: Partial<Step>,
  path: number[]
): Chapter => {
  const [index, ...nestedPath] = path;
  const steps = [...chapter.state.steps];
  steps[index] =
    nestedPath.length > 0
      ? updateNestedStep(steps[index], patch, nestedPath)
      : updateStep(steps[index], patch);
  return {
    ...chapter,
    state: {
      ...chapter.state,
      steps
    }
  };
};

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
  getChapterStepsCount,
  getChapterStepIndex,
  getChapterStep,
  isChapter,
  getChapterStepPath,
  createChapter,
  updateChapterStep
};
