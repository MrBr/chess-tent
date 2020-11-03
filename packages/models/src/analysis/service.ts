import { Analysis, TYPE_ANALYSIS } from "./types";
import { getChildStep, getStepPath, Step } from "../step";
import { SubjectPath, updateSubjectValueAt } from "../subject";

const updateAnalysisPath = (
  analysis: Analysis,
  path: SubjectPath,
  patch: Step["id"] | Step | Step[]
) => updateSubjectValueAt(analysis, path, patch);

const updateAnalysisActiveStepId = (analysis: Analysis, stepId: Step["id"]) =>
  updateAnalysisPath(analysis, ["state", "activeStepId"], stepId);

const getAnalysisActiveStep = (analysis: Analysis): Step => {
  const activeStep =
    analysis.state.activeStepId &&
    getChildStep(analysis, analysis.state.activeStepId);
  return activeStep || (analysis.state.steps[0] as Step);
};

const getAnalysisStepPath = (
  analysis: Analysis,
  step: Step
): SubjectPath | null => {
  for (let index = 0; index < analysis.state.steps.length; index++) {
    const childStep = analysis.state.steps[index];
    if (childStep.id === step.id) {
      return ["state", "steps", index];
    }
    const path = getStepPath(childStep, step);
    if (path) {
      return ["state", "steps", index, ...path];
    }
  }
  return null;
};

const updateAnalysisStep = (analysis: Analysis, step: Step) => {
  const path = getAnalysisStepPath(analysis, step);
  if (!path) {
    throw new Error("Trying to update step which doesn't exists in analysis.");
  }
  return updateAnalysisPath(analysis, path, step);
};

const createAnalysis = (
  id: string,
  steps: Analysis["state"]["steps"]
): Analysis => ({
  id,
  type: TYPE_ANALYSIS,
  state: { steps }
});

export {
  updateAnalysisStep,
  getAnalysisActiveStep,
  updateAnalysisPath,
  getAnalysisStepPath,
  createAnalysis,
  updateAnalysisActiveStepId
};
