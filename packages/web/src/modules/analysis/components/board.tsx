import React, { ComponentProps } from 'react';
import { components } from '@application';
import { Components } from '@types';
import { getAnalysisActiveStep } from '@chess-tent/models';
import Analysis from './analysis';

const { StepRenderer } = components;

const updateChapter = () => {}; // NOOP

class AnalysisBoard extends Analysis<
  ComponentProps<Components['AnalysisBoard']>
> {
  render() {
    const {
      Chessboard,
      analysis,
      initialPosition,
      initialOrientation,
    } = this.props;
    const step = getAnalysisActiveStep(analysis);

    if (!step) {
      return (
        <Chessboard
          allowAllMoves
          orientation={initialOrientation}
          fen={initialPosition || ''}
          footer={<></>}
          onMove={this.startAnalysis}
        />
      );
    }

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
        updateChapter={updateChapter}
      />
    );
  }
}
export default AnalysisBoard;
