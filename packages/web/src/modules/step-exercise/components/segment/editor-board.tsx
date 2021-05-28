import React, { ReactElement } from 'react';
import { StepBoardComponentProps } from '@types';
import { useUpdateExerciseStateProp } from '../../hooks';
import { InferUpdateStep, SegmentsProps } from './types';

const SegmentBoard = <T extends SegmentsProps>({
  step,
  updateStep,
  Chessboard,
  ...props
}: T extends SegmentsProps<infer S>
  ? InferUpdateStep<
      T,
      {
        task?: ReactElement;
        explanation?: ReactElement;
        hint?: ReactElement;
        Chessboard: StepBoardComponentProps['Chessboard'];
      }
    >
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

  const finalShapes = segment?.shapes || [];
  return (
    board || (
      <Chessboard
        viewOnly={activeSegment === 'hint'}
        allowAllMoves
        sparePieces
        orientation={orientation}
        fen={segment?.position || task.position}
        onShapesChange={updateSegmentShapes}
        shapes={finalShapes}
        onChange={updateSegmentPosition}
      />
    )
  );
};
export default SegmentBoard;
