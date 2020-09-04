import { Lesson, TYPE_LESSON } from "./types";
import {
  getLastStep,
  getNextStep,
  getParentStep,
  getPreviousStep,
  getStepIndex,
  getStepsCount,
  isSameStep,
  Step
} from "../step";
import { User } from "../user";

// Lesson
const isLesson = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_LESSON;

const getLessonParentStep = (lesson: Lesson, step: Step) => {
  for (const rootStep of lesson.state.steps) {
    if (isSameStep(rootStep, step)) {
      return null;
    }
    const parentStep = getParentStep(rootStep, step);
    if (parentStep) {
      return parentStep;
    }
  }
};

const getLessonPreviousStep = (lesson: Lesson, step: Step) => {
  let index = 0;
  for (const rootStep of lesson.state.steps) {
    const rootStep = lesson.state.steps[index];
    if (isSameStep(rootStep, step)) {
      return index > 0 ? getLastStep(lesson.state.steps[index - 1]) : null;
    }
    const previousStep = getPreviousStep(rootStep, step);
    if (previousStep) {
      return previousStep;
    }
    index++;
  }
};

const getLessonNextStep = (lesson: Lesson, step: Step) => {
  let index = 0;
  while (index < lesson.state.steps.length) {
    const rootStep = lesson.state.steps[index];
    if (isSameStep(rootStep, step)) {
      return (
        getNextStep(rootStep, step) || lesson.state.steps[index + 1] || null
      );
    }
    const nextStep = getNextStep(rootStep, step);
    if (nextStep) {
      return nextStep;
    }
    index++;
  }
};

const getLessonStepsCount = (lesson: Lesson) => {
  let count = 0;
  lesson.state.steps.forEach(step => {
    count += getStepsCount(step);
  });
  return count;
};

const getLessonStepIndex = (lesson: Lesson, step: Step) => {
  let index = 0;
  lesson.state.steps.forEach(parentStep => {
    index += getStepIndex(parentStep, step);
  });
  return index;
};

const createLesson = (id: string, steps: Step[], owner: User): Lesson => ({
  id,
  type: TYPE_LESSON,
  owner,
  state: {
    steps: steps
  }
});

export {
  isLesson,
  getLessonParentStep,
  getLessonPreviousStep,
  createLesson,
  getLessonNextStep,
  getLessonStepsCount,
  getLessonStepIndex
};
