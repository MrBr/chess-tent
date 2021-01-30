import mergeWith from 'lodash.mergewith';
import { Step, StepRoot, TYPE_STEP } from './types';
import {
  getSubjectValueAt,
  SubjectPath,
  updateSubjectValueAt,
} from '../subject';

// Step
const isStep = (entity: unknown): entity is Step =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_STEP;

/**
 * Unfortunately there is no guaranteed that single step will
 * always have the same reference hence ID must be used to check steps.
 */
const isSameStep = <T>(leftStep: Step<T> | null, rightStep: Step<T> | null) => {
  return leftStep?.id === rightStep?.id;
};

const getChildStep = (
  parentStep: Step | StepRoot,
  childId: Step['id'],
): Step | null => {
  if (isStep(parentStep) && parentStep.id === childId) {
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

const getPreviousStep = (
  parent: Step | StepRoot,
  cursorStep: Step,
): Step | null => {
  if (isStep(parent) && isSameStep(parent, cursorStep)) {
    return null;
  }
  let index = 0;
  while (index < parent.state.steps.length) {
    const childStep = parent.state.steps[index];
    if (isSameStep(childStep, cursorStep)) {
      // Found searched step, returning previous.
      // If the first or the only returning null otherwise returning previous step.
      const prevStep = parent.state.steps[index - 1];
      // Returning null if parent is StepRoot
      return prevStep ? getLastStep(prevStep) : isStep(parent) ? parent : null;
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

const getNextStep = (
  parent: Step | StepRoot,
  cursorStep: Step,
): Step | null => {
  if (isStep(parent) && isSameStep(parent, cursorStep)) {
    return parent.state.steps[0];
  }
  let index = 0;
  while (index < parent.state.steps.length) {
    const step = parent.state.steps[index];
    if (isSameStep(cursorStep, step)) {
      return (
        // Variation, dive in
        step.state.steps[0] ||
        // Next in a variation, continue
        parent.state.steps[index + 1]
      );
    }

    const nextStep = getNextStep(step, cursorStep);
    if (nextStep) {
      return nextStep;
    } else if (nextStep === undefined) {
      return parent.state.steps[index + 1];
    }
    index += 1;
  }
  return null;
};

const getRightStep = (
  parent: Step | StepRoot,
  cursorStep: Step,
): Step | null => {
  if (isStep(parent) && isSameStep(parent, cursorStep)) {
    return null;
  }
  let index = 0;
  while (index < parent.state.steps.length) {
    const step = parent.state.steps[index];
    if (isSameStep(cursorStep, step)) {
      return parent.state.steps[index + 1] || null;
    }

    const nextStep = getRightStep(step, cursorStep);
    if (nextStep) {
      return nextStep;
    }
    index += 1;
  }
  return null;
};

/**
 * Get steps count including itself.
 */
const getStepsCount = (parent: Step | StepRoot) => {
  let count = 0;
  parent.state.steps.forEach((childStep: Step) => {
    count += 1;
    count += getStepsCount(childStep);
  });
  return count;
};

/**
 * Index starts with 1
 */
const getStepIndex = (
  parent: Step | StepRoot,
  step: Step,
  indexSearch = { index: 0, end: false },
) => {
  for (let i = 0; i < parent.state.steps.length; i++) {
    const childStep = parent.state.steps[i];
    indexSearch.index += 1;
    if (isSameStep(childStep, step)) {
      indexSearch.end = true;
      return indexSearch.index;
    }
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

const getParentStep = <T extends Step | StepRoot>(
  parent: T,
  step: Step,
): Step | StepRoot | null => {
  let closestParentStep = null;
  for (const childStep of parent.state.steps) {
    if (isSameStep(childStep, step)) {
      // Found searched step, returning parent.
      return parent;
    }
    closestParentStep = getParentStep(childStep, step);
    if (closestParentStep) {
      // Searched step has previous step in its section.
      return closestParentStep;
    }
  }
  return closestParentStep;
};

const addStep = <T extends Step | StepRoot>(parentStep: T, step: Step): T => {
  return {
    ...parentStep,
    state: {
      ...parentStep.state,
      steps: [...parentStep.state.steps, step],
    },
  };
};

const addStepToLeft = (parentStep: Step, step: Step, skip = 0): Step => {
  const steps = [...parentStep.state.steps];
  steps.splice(skip, 0, step);
  return {
    ...parentStep,
    state: {
      ...parentStep.state,
      steps,
    },
  };
};

const addStepToRightOf = <T extends Step | StepRoot>(
  parent: T,
  leftStep: Step,
  newStep: Step,
): T => {
  const newStepIndex = parent.state.steps.findIndex(childStep =>
    isSameStep(childStep, leftStep),
  );
  const steps = [...parent.state.steps];

  newStepIndex >= 0
    ? steps.splice(newStepIndex + 1, 0, newStep)
    : steps.push(newStep);
  return {
    ...parent,
    state: {
      ...parent.state,
      steps,
    },
  };
};

/**
 * Remove the step and all adjacent steps
 */
const removeStep = <T extends Step | StepRoot>(
  parentStep: T,
  step: Step,
  adjacent = true,
): T => {
  let removeStep = false;
  return {
    ...parentStep,
    state: {
      ...parentStep.state,
      steps: parentStep.state.steps.filter(childStep => {
        if (isSameStep(childStep, step)) {
          removeStep = adjacent;
          return false;
        }
        return !removeStep;
      }),
    },
  };
};

const addStepRightToSame = <T extends Step | StepRoot>(
  step: T,
  newStep: Step,
): T => {
  const newStepIndex = step.state.steps.findIndex(
    childStep => childStep.stepType === newStep.stepType,
  );
  const steps = [...step.state.steps];

  newStepIndex >= 0
    ? steps.splice(newStepIndex + 1, 0, newStep)
    : steps.push(newStep);
  return {
    ...step,
    state: {
      ...step.state,
      steps,
    },
  };
};

const getStepPath = (
  parentStep: Step | StepRoot,
  step: Step,
): SubjectPath | null => {
  for (let index = 0; index < parentStep.state.steps.length; index++) {
    const childStep = parentStep.state.steps[index];
    if (isSameStep(step, childStep)) {
      return ['state', 'steps', index];
    }
    const path = getStepPath(childStep, step);
    if (path) {
      return ['state', 'steps', index, ...path];
    }
  }
  return null;
};

const getStepAt = (
  parent: Step | StepRoot,
  path: SubjectPath,
): Step | StepRoot => {
  return getSubjectValueAt(parent, path);
};

const replaceStep = <T extends Step | StepRoot>(
  stepRoot: T,
  step: Step,
  newStep: Step,
): T => {
  const stepPath = getStepPath(stepRoot, step) as SubjectPath;
  return updateSubjectValueAt(stepRoot, stepPath, newStep);
};

const updateStep = (step: Step, patch: Partial<Step>) => ({
  ...step,
  ...patch,
});

function omitSteps(objValue: any, srcValue: any, key: string) {
  if (key === 'steps') {
    return srcValue;
  }
}
const updateStepState = <T extends Step>(
  step: T,
  state: Partial<T['state']>,
) => ({
  ...step,
  state: mergeWith({}, step.state, state, omitSteps),
});

const updateNestedStep = (
  parentStep: Step,
  patch: Partial<Step>,
  path: SubjectPath,
): Step => updateSubjectValueAt(parentStep, path, patch);

const createStep = <T>(
  id: string,
  stepType: T extends Step<infer U, infer K> ? K : never,
  state: T extends Step<infer U, infer K> ? U : never,
): Step<typeof state, typeof stepType> => ({
  id,
  stepType,
  type: TYPE_STEP,
  state: {
    steps: [],
    ...state,
  },
});

export {
  isStep,
  isSameStep,
  createStep,
  addStep,
  removeStep,
  getStepsCount,
  getStepIndex,
  getLastStep,
  getNextStep,
  getRightStep,
  getPreviousStep,
  getParentStep,
  isLastStep,
  addStepRightToSame,
  addStepToRightOf,
  getChildStep,
  getStepPath,
  updateNestedStep,
  updateStep,
  updateStepState,
  getStepAt,
  addStepToLeft,
  replaceStep,
};
