import produce from 'immer';
import { Analysis, InferAnalysisStep, TYPE_ANALYSIS } from './types';
import { getChildStep, Step, updateNestedStep } from '../step';

const updateAnalysisActiveStepId = <T extends Analysis<any>>(
  analysis: T,
  stepId: Step['id'],
) =>
  produce(analysis, (draft: T) => {
    draft.state.activeStepId = stepId;
  });

const getAnalysisActiveStep = <T extends Analysis<any>>(
  analysis: T,
): InferAnalysisStep<T> => {
  const activeStep =
    analysis.state.activeStepId &&
    getChildStep(analysis, analysis.state.activeStepId);
  return (activeStep || analysis.state.steps[0]) as InferAnalysisStep<T>;
};

const updateAnalysisStep = <T extends Analysis<any>>(
  analysis: T,
  step: Step,
) => {
  return updateNestedStep(analysis, step);
};

const createAnalysis = <T extends Step>(
  id: string,
  steps: Analysis<T>['state']['steps'] = [],
): Analysis<T> => ({
  id,
  type: TYPE_ANALYSIS,
  state: { steps },
});

export {
  updateAnalysisStep,
  getAnalysisActiveStep,
  createAnalysis,
  updateAnalysisActiveStepId,
};
