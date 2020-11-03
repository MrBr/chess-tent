import React, { ComponentProps } from 'react';
import { components } from '@application';
import { Components } from '@types';
import {
  getAnalysisActiveStep,
  Step,
  updateAnalysisActiveStepId,
} from '@chess-tent/models';
import Analysis from './analysis';

const { Stepper } = components;

class AnalysisSidebar extends Analysis<
  ComponentProps<Components['AnalysisSidebar']>
> {
  setActiveStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(updateAnalysisActiveStepId(analysis, step.id));
  };

  render() {
    const { analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);

    return (
      <Stepper
        stepRoot={analysis}
        setActiveStep={this.setActiveStep}
        activeStep={step}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
      />
    );
  }
}

export default AnalysisSidebar;
