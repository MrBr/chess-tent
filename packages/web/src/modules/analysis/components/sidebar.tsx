import React, { ComponentProps } from 'react';
import { components } from '@application';
import { Components } from '@types';
import { getAnalysisActiveStep } from '@chess-tent/models';
import Analysis from './analysis';

const { Stepper } = components;

class AnalysisSidebar extends Analysis<
  ComponentProps<Components['AnalysisSidebar']>
> {
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
