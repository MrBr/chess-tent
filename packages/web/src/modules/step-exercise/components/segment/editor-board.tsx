import React from 'react';
import { ExerciseSegmentKeys, ExerciseSteps, FEN, Shape } from '@types';
import { SegmentBoardProps } from '../../types';

const SegmentBoard = <T extends ExerciseSteps, K extends ExerciseSegmentKeys>({
  step,
  Chessboard,
  updateSegment,
}: SegmentBoardProps<T, K>) => {
  const { task, activeSegment, orientation } = step.state;
  const segment = step.state[activeSegment];
  const updateSegmentPosition = (position: FEN) => updateSegment({ position });
  const updateSegmentShapes = (shapes: Shape[]) =>
    updateSegment({ shapes } as Partial<T['state'][K]>);

  return (
    <Chessboard
      viewOnly={activeSegment === 'hint'}
      allowAllMoves
      sparePieces
      orientation={orientation}
      fen={segment?.position || task.position}
      onShapesChange={updateSegmentShapes}
      shapes={segment?.shapes}
      onChange={updateSegmentPosition}
    />
  );
};
export default SegmentBoard;
