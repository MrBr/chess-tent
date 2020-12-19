import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule } from '@types';
import { updateStepState } from '@chess-tent/models';

const Editor: FunctionComponent<ComponentProps<
  ExerciseModule['EditorBoard']
>> = ({ step, Chessboard, status, updateStep }) => {
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
