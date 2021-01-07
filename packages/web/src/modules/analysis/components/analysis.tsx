import React from 'react';
import { AnalysisSystemProps, EditorSidebarProps } from '@types';
import {
  getParentStep,
  getStepPath,
  isStep,
  removeStep,
  Step,
} from '@chess-tent/models';
import { components } from '@application';

const { StepToolbox } = components;

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
    if (!isStep(parentStep)) {
      return;
    }
    updateAnalysis(
      getStepPath(analysis, parentStep),
      removeStep(parentStep, step, true),
    );
  };
  setActiveStep = (step: Step) => {
    const { updateAnalysis } = this.props;
    updateAnalysis(['state', 'activeStepId'], step.id);
  };
  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { analysis } = this.props;
    return (
      <StepToolbox
        setActiveStep={this.setActiveStep}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
        add={false}
        comment={false}
        exercise={false}
        showInput={false}
        stepRoot={analysis}
        updateChapter={() => {}}
        {...props}
      />
    );
  };
}
