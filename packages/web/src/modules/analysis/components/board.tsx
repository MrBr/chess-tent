import React from 'react';
import { components } from '@application';
import { AnalysisBoardProps } from '@types';
import { getAnalysisActiveStep } from '@chess-tent/models';
import Analysis from './analysis';

const { StepRenderer } = components;

class AnalysisBoard extends Analysis<AnalysisBoardProps> {
  render() {
    const { Chessboard, analysis, initialPosition, initialOrientation } =
      this.props;
    const step = getAnalysisActiveStep(analysis);

    if (!step) {
      return (
        <Chessboard
          allowAllMoves
          orientation={initialOrientation}
          fen={initialPosition || ''}
          onMove={this.startAnalysis}
          onChange={this.startAnalysis}
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
        updateChapter={this.updateStepRoot as () => {}}
      />
    );
  }
}
export default AnalysisBoard;
