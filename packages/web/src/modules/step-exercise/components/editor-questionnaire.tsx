import React, { ComponentProps, FunctionComponent } from 'react';
import { components } from '@application';
import { ExerciseModule } from '@types';
import { updateStepState } from '@chess-tent/models';

const { Chessboard } = components;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
  updateStep,
}) => {
  const { position, shapes } = step.state;
  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onMove={position => updateStep(updateStepState(step, { position }))}
      header={status}
      onShapesChange={shapes => updateStep(updateStepState(step, { shapes }))}
      shapes={shapes}
    />
  );
};

export default Editor;