import { Exercise, SCHEMA_EXERCISE } from "./types";
import { getItemSection, getSectionPreviousStep, Section } from "../section";
import { Step } from "../step";

// Exercise
const isExercise = (entity: unknown) => {
  if (typeof entity === "object") {
    return (
      Object.getOwnPropertyDescriptor(entity, "type")?.value === SCHEMA_EXERCISE
    );
  }
  return false;
};

const getActiveStepSection = (exercise: Exercise): Section => {
  return getItemSection(exercise.section, exercise.activeStep) as Section;
};

const getExercisePreviousStep = (exercise: Exercise, step: Step) => {
  return getSectionPreviousStep(exercise.section, step);
};

const setActiveStep = (exercise: Exercise, step: Step): Exercise => {
  return {
    ...exercise,
    activeStep: step
  };
};

const createExercise = (
  id: string,
  section: Section,
  activeStep: Step
): Exercise => ({
  id,
  type: SCHEMA_EXERCISE,
  section: section,
  activeStep
});

export {
  // Exercise
  isExercise,
  getExercisePreviousStep,
  createExercise,
  getActiveStepSection,
  setActiveStep
};
