import {
  Analysis,
  InferAnalysis,
  InferAnalysisStep,
  TYPE_ANALYSIS,
} from './types';
import { getChildStep, getStepPath, Step } from '../step';
import { SubjectPath, updateSubjectValueAt } from '../subject';

const updateAnalysisPath = <T>(
  analysis: InferAnalysis<T>,
  path: SubjectPath,
  patch: Step['id'] | Step | Step[],
) => updateSubjectValueAt(analysis, path, patch);

const updateAnalysisActiveStepId = <T>(
  analysis: InferAnalysis<T>,
  stepId: Step['id'],
) => updateAnalysisPath(analysis, ['state', 'activeStepId'], stepId);

const getAnalysisActiveStep = <T>(
  analysis: InferAnalysis<T>,
): InferAnalysisStep<T> => {
  const activeStep =
    analysis.state.activeStepId &&
    getChildStep(analysis, analysis.state.activeStepId);
  return (activeStep || analysis.state.steps[0]) as InferAnalysisStep<T>;
};

const getAnalysisStepPath = <T>(
  analysis: InferAnalysis<T>,
  step: Step,
): SubjectPath | null => {
  for (let index = 0; index < analysis.state.steps.length; index++) {
    const childStep = analysis.state.steps[index];
    if (childStep.id === step.id) {
      return ['state', 'steps', index];
    }
    const path = getStepPath(childStep, step);
    if (path) {
      return ['state', 'steps', index, ...path];
    }
  }
  return null;
};

const updateAnalysisStep = <T>(analysis: InferAnalysis<T>, step: Step) => {
  const path = getAnalysisStepPath(analysis, step);
  if (!path) {
    throw new Error("Trying to update step which doesn't exists in analysis.");
  }
  return updateAnalysisPath(analysis, path, step);
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
  updateAnalysisPath,
  getAnalysisStepPath,
  createAnalysis,
  updateAnalysisActiveStepId,
};
