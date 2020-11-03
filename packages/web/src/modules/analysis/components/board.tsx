import React, { ComponentProps } from 'react';
import { components } from '@application';
import { Components } from '@types';
import { getAnalysisActiveStep } from '@chess-tent/models';
import Analysis from './analysis';

const { StepRenderer } = components;

class AnalysisBoard extends Analysis<
  ComponentProps<Components['AnalysisBoard']>
> {
  render() {
    const { Chessboard, analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);

    return (
      <StepRenderer
        step={step}
        component="EditorBoard"
        activeStep={step}
        stepRoot={analysis}
        Chessboard={Chessboard}
        setActiveStep={this.setActiveStep}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
      />
    );
  }
}
export default AnalysisBoard;
