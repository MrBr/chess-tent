import React from 'react';
import { components } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';
import { SegmentsProps } from './types';

const { Chessboard } = components;

const SegmentBoard = <T extends SegmentsProps>({
  children,
  step,
  updateStep,
}: T extends SegmentsProps<infer S>
  ? T & { updateStep: (step: S) => void }
  : never) => {
  const { task, activeSegment, orientation } = step.state;
  const segment = step.state[activeSegment];
  const updateSegmentPosition = useUpdateExerciseStateProp(updateStep, step, [
    activeSegment,
    'position',
  ]);
  const updateSegmentShapes = useUpdateExerciseStateProp(updateStep, step, [
    activeSegment,
    'shapes',
  ]);

  return activeSegment === 'task' ? (
    children
  ) : (
    <Chessboard
      orientation={orientation}
      fen={segment?.position || task.position}
      onShapesChange={updateSegmentShapes}
      onChange={updateSegmentPosition}
    />
  );
};
export default SegmentBoard;
