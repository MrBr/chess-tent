import React, { ComponentProps } from 'react';
import { components, ui, utils } from '@application';
import { Components } from '@types';
import { getAnalysisActiveStep } from '@chess-tent/models';
import Analysis from './analysis';

const { Stepper } = components;
const { Button } = ui;
const { noop } = utils;

class AnalysisSidebar extends Analysis<
  ComponentProps<Components['AnalysisSidebar']>
> {
  render() {
    const { analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);

    if (!step) {
      return (
        <Button
          size="extra-small"
          onClick={() => this.startAnalysis()}
          variant="regular"
        >
          Start Analysis
        </Button>
      );
    }

    return (
      <Stepper
        stepRoot={analysis}
        setActiveStep={this.setActiveStep}
        activeStep={step}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
        renderToolbox={this.renderToolbox}
        updateChapter={noop}
      />
    );
  }
}

export default AnalysisSidebar;
