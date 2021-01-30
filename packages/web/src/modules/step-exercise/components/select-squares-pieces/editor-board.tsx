import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseSelectSquaresAndPiecesStep } from '@types';
import { SegmentBoard } from '../segment';
import { useUpdateExerciseStateProp } from '../../hooks';

const Editor: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['EditorBoard']
  >
> = ({ step, Chessboard, status, updateStep }) => {
  const updateTaskPosition = useUpdateExerciseStateProp(updateStep, step, [
    'task',
    'position',
  ]);
  const updateTaskShapes = useUpdateExerciseStateProp(updateStep, step, [
    'task',
    'shapes',
  ]);

  const { position, shapes } = step.state.task;

  return (
    <SegmentBoard
      step={step}
      updateStep={updateStep}
      Chessboard={Chessboard}
      task={
        <Chessboard
          allowAllMoves
          sparePieces
          fen={position}
          onPieceDrop={updateTaskPosition}
          onPieceRemove={updateTaskPosition}
          onMove={updateTaskPosition}
          onShapesChange={updateTaskShapes}
          header={status}
          shapes={shapes}
        />
      }
    />
  );
};

export default Editor;
