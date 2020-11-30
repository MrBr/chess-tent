import React from 'react';
import { AnalysisSystemProps } from '@types';
import {
  getParentStep,
  getStepPath,
  removeStep,
  Step,
} from '@chess-tent/models';

export default class Analysis<
  T extends AnalysisSystemProps
> extends React.Component<T> {
  updateStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(getStepPath(analysis, step), step);
  };
  removeStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    const parentStep = getParentStep(analysis, step);
    updateAnalysis(
      getStepPath(analysis, parentStep),
      removeStep(parentStep, step, true),
    );
  };
  setActiveStep = (step: Step) => {
    const { updateAnalysis } = this.props;
    updateAnalysis(['state', 'activeStepId'], step.id);
  };
}
