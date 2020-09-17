import { Step, TYPE_STEP } from "./types";

// Step
const isStep = (entity: unknown): entity is Step =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_STEP;

/**
 * Unfortunately there is no guaranteed that single step will
 * always have the same reference hence ID must be used to check steps.
 */
const isSameStep = (leftStep: Step | null, rightStep: Step | null) => {
  return leftStep?.id === rightStep?.id;
};

const getChildStep = (parentStep: Step, childId: Step["id"]): Step | null => {
  if (parentStep.id === childId) {
    return parentStep;
  }
  for (const index in parentStep.state.steps) {
    const step = parentStep.state.steps[index];
    const childStep = getChildStep(step, childId);
    if (childStep) {
      return childStep;
    }
  }
  return null;
};

const getPreviousStep = (parentStep: Step, cursorStep: Step): Step | null => {
  if (isSameStep(parentStep, cursorStep)) {
    return null;
  }
  let index = 0;
  while (index < parentStep.state.steps.length) {
    const childStep = parentStep.state.steps[index];
    if (isSameStep(childStep, cursorStep)) {
      // Found searched step, returning previous.
      // If the first or the only returning null otherwise returning previous step.
      const prevStep = parentStep.state.steps[index - 1];
      return prevStep ? getLastStep(prevStep) : parentStep;
    }
    const prevStep = getPreviousStep(childStep, cursorStep);
    if (prevStep) {
      // Searched step has previous step in its section.
      return prevStep;
    }
    index += 1;
  }
  return null;
};

const getNextStep = (parentStep: Step, cursorStep: Step): Step | null => {
  if (isSameStep(parentStep, cursorStep)) {
    return parentStep.state.steps[0];
  }
  let index = 0;
  while (index < parentStep.state.steps.length) {
    const step = parentStep.state.steps[index];
    if (isSameStep(cursorStep, step)) {
      return (
        // Variation, dive in
        step.state.steps[0] ||
        // Next in a variation, continue
        parentStep.state.steps[index + 1]
      );
    }

    const nextStep = getNextStep(step, cursorStep);
    if (nextStep) {
      return nextStep;
    } else if (nextStep === undefined) {
      return parentStep.state.steps[index + 1];
    }
    index += 1;
  }
  return null;
};

/**
 * Get steps count including itself.
 * @param step
 * @param count
 */
const getStepsCount = (step: Step) => {
  let count = 1;
  step.state.steps.forEach((childStep: Step) => {
    count += getStepsCount(childStep);
  });
  return count;
};

const getStepIndex = (
  parentStep: Step,
  step: Step,
  indexSearch = { index: 0, end: false }
) => {
  if (isSameStep(parentStep, step)) {
    indexSearch.index += 1;
    indexSearch.end = true;
    return indexSearch.index;
  }
  indexSearch.index += 1;
  for (let i = 0; i < parentStep.state.steps.length; i++) {
    const childStep = parentStep.state.steps[i];
    getStepIndex(childStep, step, indexSearch);
    if (indexSearch.end) {
      return indexSearch.index;
    }
  }
  return indexSearch.index;
};

const getLastStep = (parentStep: Step, recursive = true): Step => {
  const lastStep =
    parentStep.state.steps[parentStep.state.steps.length - 1] || parentStep;
  return isSameStep(lastStep, parentStep)
    ? lastStep
    : recursive
    ? getLastStep(lastStep)
    : lastStep;
};

const isLastStep = (parentStep: Step, step: Step, recursive = true) => {
  return isSameStep(getLastStep(parentStep, recursive), step);
};

const getParentStep = (parentStep: Step, step: Step): Step | null => {
  let closestParentStep = null;
  for (const childStep of parentStep.state.steps) {
    if (isSameStep(childStep, step)) {
      // Found searched step, returning previous.
      // If the first or the only returning null otherwise returning previous step.
      return parentStep;
    }
    closestParentStep = getParentStep(childStep, step);
    if (closestParentStep) {
      // Searched step has previous step in its section.
      return closestParentStep;
    }
  }
  return closestParentStep;
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

const addStepRightToSame = (step: Step, newStep: Step) => {
  const newStepIndex = step.state.steps.findIndex(
    childStep => childStep.stepType !== newStep.stepType
  );
  const steps = [...step.state.steps];

  newStepIndex >= 0
    ? steps.splice(newStepIndex, 0, newStep)
    : steps.push(newStep);
  return {
    ...step,
    state: {
      ...step.state,
      steps
    }
  };
};

const getStepPath = (parentStep: Step, step: Step): number[] | null => {
  for (let index = 0; index < parentStep.state.steps.length; index++) {
    const childStep = parentStep.state.steps[index];
    if (isSameStep(step, childStep)) {
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

const updateStep = (step: Step, patch: Partial<Step>) => ({
  ...step,
  ...patch
});

const updateNestedStep = (
  parentStep: Step,
  patch: Partial<Step>,
  path: number[]
): Step => {
  const [index, ...nestedPath] = path;
  const steps = [...parentStep.state.steps];
  steps[index] = {
    ...steps[index],
    ...(nestedPath.length > 0
      ? updateNestedStep(steps[index], patch, nestedPath)
      : patch)
  };
  return {
    ...parentStep,
    state: {
      ...parentStep.state,
      steps
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
  isSameStep,
  createStep,
  addStep,
  getStepsCount,
  getStepIndex,
  getLastStep,
  getNextStep,
  getPreviousStep,
  getParentStep,
  isLastStep,
  addStepRightToSame,
  getChildStep,
  getStepPath,
  updateNestedStep,
  updateStep
};
