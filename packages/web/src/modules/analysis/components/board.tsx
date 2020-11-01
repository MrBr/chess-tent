import React from 'react';
import { components } from '@application';
import { Components } from '@types';

const { Chessboard, StepRenderer } = components;

const AnalysisBoard: Components['AnalysisBoard'] = ({
  step,
  analysis,
  setActiveStep,
  updateStep,
  removeStep,
}) => {
  return (
    <StepRenderer
      step={step}
      component="EditorBoard"
      activeStep={step}
      stepRoot={analysis}
      Chessboard={Chessboard}
      setActiveStep={setActiveStep}
      updateStep={updateStep}
      removeStep={removeStep}
    />
  );
};

export default AnalysisBoard;
