import React, { ReactElement } from 'react';
import { StepBoardComponentProps } from '@types';
import { useUpdateExerciseStateProp } from '../../hooks';
import { SegmentsProps } from './types';

const SegmentBoard = <T extends SegmentsProps>({
  step,
  updateStep,
  Chessboard,
  ...props
}: T extends SegmentsProps<infer S>
  ? T & {
      updateStep: (step: S) => void;
      task?: ReactElement;
      explanation?: ReactElement;
      hint?: ReactElement;
      Chessboard: StepBoardComponentProps['Chessboard'];
    }
  : never) => {
  const { task, activeSegment, orientation } = step.state;
  const board = props[activeSegment] as ReactElement;
  const segment = step.state[activeSegment];
  const updateSegmentPosition = useUpdateExerciseStateProp(updateStep, step, [
    activeSegment,
    'position',
  ]);
  const updateSegmentShapes = useUpdateExerciseStateProp(updateStep, step, [
    activeSegment,
    'shapes',
  ]);

  return (
    board || (
      <Chessboard
        allowAllMoves
        sparePieces
        orientation={orientation}
        fen={segment?.position || task.position}
        onShapesChange={updateSegmentShapes}
        onChange={updateSegmentPosition}
      />
    )
  );
};
export default SegmentBoard;
