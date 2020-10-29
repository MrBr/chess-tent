import { Analysis, TYPE_ANALYSIS } from "./types";
import { getStepPath, Step } from "../step";
import { SubjectPath, updateSubjectValueAt } from "../subject";

const updateAnalysisStep = (
  analysis: Analysis,
  patch: Partial<Step>,
  path: SubjectPath
) => updateSubjectValueAt(analysis, path, patch);

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

const createAnalysis = (id: string, steps: Step[] = []): Analysis => ({
  id,
  type: TYPE_ANALYSIS,
  state: { steps }
});

export { updateSubjectValueAt, getAnalysisStepPath, createAnalysis };
