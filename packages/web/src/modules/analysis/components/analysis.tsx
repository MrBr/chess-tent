import React from 'react';
import { services } from '@application';
import { AnalysisSystemProps } from '@types';
import {
  Step,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
} from '@chess-tent/models';

export default class Analysis<
  T extends AnalysisSystemProps
> extends React.Component<T> {
  updateStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(updateAnalysisStep(analysis, step));
  };
  removeStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(services.removeAnalysisStep(analysis, step));
  };
  setActiveStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(updateAnalysisActiveStepId(analysis, step.id));
  };
}
