import { Step, StepRoot } from './types';
import { isSameStep } from './service';

/**
 * It's hard to end recursive replacement with draft.
 * This helper service is used only to implement step replacement feature
 * with option to exist recursion once replacement is done.
 */
export const replaceStepBase = <T extends Step | StepRoot>(
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
    if (replaceStepBase(childStep, step, newStep)) {
      return true;
    }
  }
  return false;
};
