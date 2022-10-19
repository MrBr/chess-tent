import { Step, StepRoot } from './types';
import { isSameStep } from './service';

/**
 * It's hard to end recursive replacement with draft.
 * This helper service is used only to implement step replacement feature
 * with option to exist recursion once replacement is done.
 */
export const replaceStepRecursive = <T extends Step | StepRoot>(
  draft: T,
  step: Step,
  newStep: Step,
): boolean => {
  for (let index = 0; index < draft.state.steps.length; index++) {
    const childStep = draft.state.steps[index];
    if (isSameStep(step, childStep)) {
      draft.state.steps[index] = newStep;
      return true;
    }
    if (replaceStepRecursive(childStep, step, newStep)) {
      return true;
    }
  }
  return false;
};

/**
 * Helper method to more efficiently perform recursive remove.
 * Recursive in this context means it traversal.
 */
export const removeStepRecursive = <T extends Step | StepRoot>(
  draft: T,
  step: Step,
  adjacent: boolean,
) => {
  let removeStep = false;
  let stepRemoved = false;
  draft.state.steps = draft.state.steps.filter(childStep => {
    if (isSameStep(childStep, step)) {
      removeStep = adjacent;
      stepRemoved = true;
      return false;
    }
    // If current step isn't the one to remove, try with his children
    // If step is removed don't search further
    if (!stepRemoved) {
      stepRemoved = removeStepRecursive(childStep, step, adjacent);
    }
    return !removeStep;
  });
  return stepRemoved;
};
