import {
  createAnalysis,
  getParentStep,
  getPreviousStep,
  isStep,
  removeStep,
  Step,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
  PatchListener,
} from '@chess-tent/models';
import { utils } from '@application';
import { AppAnalysis, Steps } from '@types';

export const createAnalysisService = (): AppAnalysis => {
  return createAnalysis<Steps>(utils.generateIndex());
};

export const removeAnalysisStep = (
  analysis: AppAnalysis,
  step: Step,
  patchListener?: PatchListener,
): AppAnalysis => {
  const newActiveStep = getPreviousStep(analysis, step);
  const parentStep = getParentStep(analysis, step);
  if (!isStep(parentStep)) {
    return analysis;
  }
  return updateAnalysisActiveStepId(
    updateAnalysisStep(
      analysis,
      removeStep(parentStep, step, step.stepType !== 'variation'),
    ),
    newActiveStep?.id,
    patchListener,
  );
};
