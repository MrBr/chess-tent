import { Step, TYPE_STEP } from "./types";

// Step
const isStep = (entity: unknown): entity is Step =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_STEP;

const getPreviousStep = (rootStep: Step, step: Step): Step | null => {
  let lastStep = null;
  for (const childStep of rootStep.state.steps) {
    if (childStep === step) {
      // Found searched step, returning previous.
      // If the first or the only returning null otherwise returning previous step.
      return lastStep;
    }
    const prevStep = getPreviousStep(childStep, step);
    if (prevStep) {
      // Searched step has previous step in its section.
      return prevStep;
    }
  }
  return lastStep;
};

const getLastStep = (rootStep: Step): Step | null => {
  return rootStep.state.steps[rootStep.state.steps.length - 1] || null;
};

const isLastStep = (rootStep: Step, step: Step) => {
  return getLastStep(rootStep) === step;
};

const getParentStep = (rootStep: Step, step: Step): Step | null => {
  let parentStep = null;
  for (const childStep of rootStep.state.steps) {
    if (childStep === step) {
      // Found searched step, returning previous.
      // If the first or the only returning null otherwise returning previous step.
      return rootStep;
    }
    parentStep = getParentStep(childStep, step);
    if (parentStep) {
      // Searched step has previous step in its section.
      return parentStep;
    }
  }
  return parentStep;
};

const addStep = (parentStep: Step, step: Step): Step => {
  return {
    ...parentStep,
    state: {
      ...parentStep.state,
      steps: [...parentStep.state.steps, step]
    }
  };
};

const createStep = <T>(
  id: string,
  stepType: T extends Step<infer U, infer K> ? K : never,
  state: T extends Step<infer U, infer K> ? U : never
): Step<typeof state, typeof stepType> => ({
  id,
  stepType,
  type: TYPE_STEP,
  state: {
    steps: [],
    ...state
  }
});

export {
  isStep,
  createStep,
  addStep,
  getLastStep,
  getPreviousStep,
  getParentStep,
  isLastStep
};
