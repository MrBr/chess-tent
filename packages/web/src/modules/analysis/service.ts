import {
  createAnalysis,
  getParentStep,
  getPreviousStep,
  isStep,
  removeStep,
  Step,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
} from '@chess-tent/models';
import { services, utils } from '@application';
import { AppAnalysis, FEN, Steps } from '@types';

export const removeAnalysisStep = (
  analysis: AppAnalysis,
  step: Step,
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
    newActiveStep.id,
  );
};

export const createAnalysisService = (param: [Step] | FEN): AppAnalysis => {
  const steps = (Array.isArray(param)
    ? param
    : [services.createStep('variation', { position: param })]) as [Steps];
  return createAnalysis<Steps>(utils.generateIndex(), steps);
};
