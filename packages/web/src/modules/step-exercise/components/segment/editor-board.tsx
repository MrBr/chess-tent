import React from 'react';
import { ExerciseSegmentKeys, ExerciseSteps, FEN, Shape } from '@types';
import { SegmentBoardProps } from '../../types';

const SegmentBoard = <T extends ExerciseSteps>({
  step,
  Chessboard,
  updateSegment,
  position,
}: SegmentBoardProps<T> & { position?: FEN }) => {
  const { task, activeSegment, orientation } = step.state;
  const segment = step.state[activeSegment];

  const viewOnly = activeSegment === 'hint' || activeSegment === 'explanation';
  const fen = position || task.position;
  const shapes =
    activeSegment === 'hint'
      ? [...(task.shapes || []), ...(segment.shapes || [])]
      : segment.shapes;

  // Only task segment can update board
  const boardSetup = (position: FEN) =>
    updateSegment({ position, shapes: [] } as T['state']['task']);
  const updateSegmentPosition = (position: FEN) =>
    updateSegment({ position } as T['state']['task']);

  const updateSegmentShapes = (shapes: Shape[]) =>
    updateSegment({ shapes } as Partial<T['state'][ExerciseSegmentKeys]>);

  return (
    <Chessboard
      allowAllMoves
      sparePieces
      viewOnly={viewOnly}
      orientation={orientation}
      fen={fen}
      onShapesChange={updateSegmentShapes}
      shapes={shapes}
      onChange={updateSegmentPosition}
      onClear={boardSetup}
      onReset={boardSetup}
      onFENSet={boardSetup}
    />
  );
};

export default SegmentBoard;
