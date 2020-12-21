import {
  Analysis,
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
import { FEN } from '@types';

export const removeAnalysisStep = (
  analysis: Analysis,
  step: Step,
): Analysis => {
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

export const createAnalysisService = (param: [Step] | FEN): Analysis => {
  const steps = Array.isArray(param)
    ? param
    : ([
        services.createStep('variation', { position: param }),
      ] as Analysis['state']['steps']);
  return createAnalysis(utils.generateIndex(), steps);
};
