import React, { ComponentProps, FunctionComponent } from 'react';
import { components } from '@application';
import { ExerciseModule } from '@types';
import { updateStepState } from '@chess-tent/models';

const { Chessboard } = components;

const Editor: FunctionComponent<ComponentProps<
  ExerciseModule['EditorBoard']
>> = ({ step, status, updateStep }) => {
  const { position, shapes } = step.state;

  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onPieceDrop={position => updateStep(updateStepState(step, { position }))}
      onPieceRemove={position =>
        updateStep(updateStepState(step, { position }))
      }
      onMove={position => updateStep(updateStepState(step, { position }))}
      onShapesChange={shapes => updateStep(updateStepState(step, { shapes }))}
      header={status}
      shapes={shapes}
    />
  );
};

export default Editor;
