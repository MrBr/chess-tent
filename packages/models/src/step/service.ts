import { Step, StepRoot, StepType, TYPE_STEP } from './types';
import { updateSubject } from '../subject';
import { createService } from '../_helpers';
import { replaceStepRecursive, removeStepRecursive } from './_helpers';

// Step
const isStep = (entity: unknown): entity is Step =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_STEP;

/**
 * Unfortunately there is no guaranteed that single step will
 * always have the same reference hence ID must be used to check steps.
 */
const isSameStep = <T extends {}>(
  leftStep: Step<T> | null,
  rightStep: Step<T> | null,
) => {
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

function getLastStep(parentStep: Step, recursive: boolean): Step;
function getLastStep(
  parentStep: Step,
  recursive: boolean,
  skip?: (step: Step) => boolean | undefined,
): Step | null;
function getLastStep(
  parentStep: Step,
  recursive = true,
  skip?: (step: Step) => boolean | undefined,
) {
  let index = parentStep.state.steps.length - 1;
  while (index >= 0) {
    const step = parentStep.state.steps[index];

    const lastStep = recursive ? getLastStep(step, recursive, skip) : step;

    if (lastStep) {
      return lastStep;
    }

    index -= 1;
  }
  return (((!skip || !skip(parentStep)) && parentStep) || null) as ReturnType<
    typeof getLastStep
  >;
}

const getFirstStep = (
  parentStep: Step,
  recursive = true,
  skip?: (step: Step) => boolean,
): Step | null => {
  let index = 0;
  while (index < parentStep.state.steps.length) {
    const firstStep = parentStep.state.steps[index];

    const childFirstStep = recursive
      ? getFirstStep(firstStep, recursive, skip)
      : firstStep;

    if (!isSameStep(childFirstStep, firstStep)) {
      return firstStep;
    }

    if (firstStep && (!skip || !skip(firstStep))) {
      return firstStep;
    }

    index += 1;
  }
  return null;
};

/**
 * The next prev horizontally or vertically.
 */
const getPreviousStep = (
  parent: Step | StepRoot,
  cursorStep: Step,
  skip?: (step: Step) => boolean,
): Step | null | undefined => {
  // Optimisation?
  if (isStep(parent) && isSameStep(parent, cursorStep)) {
    return null;
  }

  let index = 0;
  let didFound;
  while (index < parent.state.steps.length) {
    const currentStep = parent.state.steps[index];
    const prevStep = getPreviousStep(currentStep, cursorStep, skip);

    if (prevStep) {
      return prevStep;
    }

    // Step found, try with first prev which is the current
    if (prevStep === undefined && (!skip || !skip(currentStep))) {
      return currentStep;
    }

    // Step found
    if (isSameStep(currentStep, cursorStep) || prevStep === undefined) {
      didFound = true;
      break;
    }

    index += 1;
  }

  // Exclude matched step
  index -= 1;
  while (didFound && index >= 0) {
    const prevStep = getLastStep(parent.state.steps[index], true, skip);
    if (prevStep) {
      return prevStep;
    }
    index -= 1;
  }

  return didFound ? undefined : null;
};

/**
 * The next step horizontally or vertically.
 */
const getNextStep = (
  parent: Step | StepRoot,
  cursorStep: Step,
  skip?: (step: Step) => boolean,
): Step | null | undefined => {
  let index = 0;
  let didFound;
  while (index < parent.state.steps.length) {
    const step = parent.state.steps[index];

    const nextStep = isSameStep(cursorStep, step)
      ? getFirstStep(step, true, skip)
      : getNextStep(step, cursorStep, skip);
    if (nextStep) {
      return nextStep;
    }

    // Cursor step is inside the current steps but nothing match the search
    // Skip the current step and search further
    if (isSameStep(cursorStep, step) || nextStep === undefined) {
      didFound = true;
      break;
    }
    index += 1;
  }

  // Exclude matched step
  index += 1;
  while (index < parent.state.steps.length) {
    const step = parent.state.steps[index];
    const nextStep =
      ((!skip || !skip(step)) && step) || getFirstStep(step, true, skip);
    // Don't include cursor step
    if (nextStep) {
      return nextStep;
    }
    index += 1;
  }

  return didFound ? undefined : null;
};

/**
 * The next horizontal step. The same depth level.
 */
const getRightStep = (
  parent: Step | StepRoot,
  cursorStep: Step,
  skip?: (step: Step) => boolean,
): Step | null => {
  if (!isStep(parent)) {
    return getFirstStep(cursorStep, false, skip);
  }

  let index = parent.state.steps.indexOf(cursorStep) + 1;
  while (index < parent.state.steps.length) {
    const rightStep = parent.state.steps[index];

    if (rightStep && (!skip || !skip(rightStep))) {
      return rightStep;
    }

    index += 1;
  }
  return null;
};

const getLeftStep = (
  rootStep: Step | StepRoot,
  cursorStep: Step,
  skip?: (step: Step, index: number) => boolean,
): Step | null => {
  const parentStep = getParentStep(rootStep, cursorStep);

  // Not traversing stepRoots atm?
  if (!parentStep || !isStep(parentStep)) {
    return null;
  }

  let index = parentStep.state.steps.indexOf(cursorStep) - 1;
  while (index >= 0) {
    let leftStep = parentStep.state.steps[index];

    if (leftStep && (!skip || !skip(leftStep, index))) {
      return leftStep;
    }

    index -= 1;
  }

  // Move down the main line
  if (!skip || !skip(parentStep, index)) {
    return parentStep;
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

const addStep = createService(
  <T extends Step | StepRoot>(draft: T, step: Step): T => {
    draft.state.steps.push(step);
    return draft;
  },
);

const addStepToLeft = createService(
  <T extends Step | StepRoot>(draft: T, step: Step, skip: number): T => {
    draft.state.steps.splice(skip, 0, step);
    return draft;
  },
);

const addStepToRightOf = createService(
  <T extends Step | StepRoot>(draft: T, leftStep: Step, newStep: Step) => {
    const newStepIndex = draft.state.steps.findIndex(childStep =>
      isSameStep(childStep, leftStep),
    );

    newStepIndex >= 0
      ? draft.state.steps.splice(newStepIndex + 1, 0, newStep)
      : draft.state.steps.push(newStep);
    return draft;
  },
);

/**
 * Remove the step and optionally all adjacent steps
 */
const removeStep = createService(
  <T extends Step | StepRoot>(draft: T, step: Step, adjacent: boolean): T => {
    removeStepRecursive(draft, step, adjacent);
    return draft;
  },
);

const addStepAfterType = createService(
  <T extends Step | StepRoot>(
    draft: T,
    types: StepType[] | StepType,
    newStep: Step,
  ): T => {
    let lastIndexOfType = -1;

    draft.state.steps.forEach(({ stepType }, index) => {
      if (
        (Array.isArray(types) && types.includes(stepType)) ||
        stepType === types
      ) {
        lastIndexOfType = index;
      }
    });

    draft.state.steps.splice(lastIndexOfType + 1, 0, newStep);

    return draft;
  },
);

const addVariationStep = createService(
  <T extends Step | StepRoot>(draft: T, newStep: Step): T => {
    addStepAfterType(draft, ['variation', 'description'], newStep);

    return draft;
  },
);

const updateStep = (step: Step, patch: Partial<Step>) =>
  updateSubject(step, patch);

// TODO: Keep eye on this when changing step update logic
// or if something strange starts happening
function keepArrays(objValue: any, srcValue: any, key: string) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
}

const updateStepState = createService(
  <T extends Step>(draft: T, state: Partial<T['state']>): T => {
    Object.assign(draft.state, state);
    return draft;
  },
);

const replaceStep = createService(
  <T extends Step | StepRoot>(draft: T, step: Step, newStep: Step): T => {
    replaceStepRecursive(draft, step, newStep);
    return draft;
  },
);

const updateNestedStep = createService(
  <T extends Step | StepRoot>(draft: T, step: Step): T => {
    replaceStepRecursive(draft, step, step);
    // draft.state.steps[0] = step;
    return draft;
    // replaceStep(draft, step, step) as T,
  },
);

const flattenSteps = (stepRoot: StepRoot, steps: Step[] = []) => {
  let index = 0;
  while (index < stepRoot.state.steps.length) {
    const step = stepRoot.state.steps[index];
    steps.push(step);
    flattenSteps(step, steps);
    index += 1;
  }
  return steps;
};

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
  getFirstStep,
  getRightStep,
  getNextStep,
  getLeftStep,
  getPreviousStep,
  getParentStep,
  isLastStep,
  addVariationStep,
  addStepAfterType,
  addStepToRightOf,
  getChildStep,
  updateNestedStep,
  updateStep,
  updateStepState,
  addStepToLeft,
  replaceStep,
  flattenSteps,
};
