import { Lesson, TYPE_LESSON } from "./types";
import {
  getLastStep,
  getParentStep,
  getPreviousStep,
  isStep,
  Step
} from "../step";
import { updateSubjectState } from "../subject";
import { User } from "../user";

// Lesson
const isLesson = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_LESSON;

const getLessonParentStep = (lesson: Lesson, step: Step) => {
  for (const rootStep of lesson.state.steps) {
    if (rootStep === step) {
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
    if (rootStep === step) {
      return index > 0 ? getLastStep(lesson.state.steps[index - 1]) : null;
    }
    const previousStep = getPreviousStep(rootStep, step);
    if (previousStep) {
      return previousStep;
    }
    index++;
  }
};

const setActiveStep = (lesson: Lesson, step: Step): Lesson =>
  updateSubjectState(lesson, {
    activeStep: step
  });

const createLesson = (
  id: string,
  steps: Step[],
  activeStep: Step,
  owner: User
): Lesson => ({
  id,
  type: TYPE_LESSON,
  owner,
  state: {
    activeStep,
    steps: steps
  }
});

export {
  isLesson,
  getLessonParentStep,
  getLessonPreviousStep,
  createLesson,
  setActiveStep
};
