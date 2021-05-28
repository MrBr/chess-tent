import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseSelectSquaresAndPiecesStep } from '@types';
import { SegmentBoard } from '../segment';
import { useUpdateExerciseStateProp } from '../../hooks';

const Editor: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['EditorBoard']
  >
> = ({ step, Chessboard, updateStep }) => {
  const { task, activeSegment } = step.state;
  const { position } = task;
  const segment = step.state[activeSegment];
  const updateTaskPosition = useUpdateExerciseStateProp(updateStep, step, [
    'task',
    'position',
  ]);
  const updateShapes = useUpdateExerciseStateProp(updateStep, step, [
    activeSegment,
    'shapes',
  ]);

  const finalShapes = segment?.shapes || [];
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
          onShapesChange={updateShapes}
          shapes={finalShapes}
        />
      }
    />
  );
};

export default Editor;
