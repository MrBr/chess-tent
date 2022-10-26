import { Analysis, InferAnalysisStep, TYPE_ANALYSIS } from './types';
import { getChildStep, Step, updateNestedStep } from '../step';
import { createService } from '../_helpers';

const getAnalysisActiveStep = <T extends Analysis<any>>(
  analysis: T,
): InferAnalysisStep<T> => {
  const activeStepId = analysis.state.activeStepId;
  const activeStep = activeStepId && getChildStep(analysis, activeStepId);

  return (activeStep || analysis.state.steps[0]) as InferAnalysisStep<T>;
};

const updateAnalysisActiveStepId = createService(
  <T extends Analysis<any>>(draft: T, stepId: Step['id'] | undefined): T => {
    draft.state.activeStepId = stepId;
    return draft;
  },
);

const updateAnalysisStep = updateNestedStep;

const isEmptyAnalysis = <T extends Analysis<any>>(analysis: T) =>
  analysis.state.steps.length === 0;

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
  isEmptyAnalysis,
};
