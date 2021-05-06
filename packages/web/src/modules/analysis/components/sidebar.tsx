import React, { ComponentProps } from 'react';
import { components, ui, services } from '@application';
import { Components } from '@types';
import { getAnalysisActiveStep } from '@chess-tent/models';
import Analysis from './analysis';

const { Stepper } = components;
const { Button } = ui;

const updateChapter = () => {}; // NOOP

class AnalysisSidebar extends Analysis<
  ComponentProps<Components['AnalysisSidebar']>
> {
  render() {
    const { analysis, updateAnalysis, initialPosition } = this.props;
    const step = getAnalysisActiveStep(analysis);

    if (!step) {
      return (
        <Button
          size="extra-small"
          onClick={() => {
            const newStep = services.createStep('variation', {
              position: initialPosition,
            });
            updateAnalysis(['state', 'steps'], [newStep]);
          }}
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
        updateChapter={updateChapter}
      />
    );
  }
}

export default AnalysisSidebar;
