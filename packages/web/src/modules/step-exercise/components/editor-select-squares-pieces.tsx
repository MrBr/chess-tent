import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components } from '@application';
import { ExerciseModule, Shape } from '@types';
import { updateStepState } from '@chess-tent/models';

const { Chessboard } = components;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
  updateStep,
}) => {
  const { position, shapes } = step.state;
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      updateStep(updateStepState(step, { shapes }));
    },
    [updateStep, step],
  );
  const handleMove = useCallback(
    position => {
      updateStep(updateStepState(step, { position }));
    },
    [step, updateStep],
  );

  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onMove={handleMove}
      header={status}
      onShapesChange={handleShapes}
      shapes={shapes}
    />
  );
};

export default Editor;
