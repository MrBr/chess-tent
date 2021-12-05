import React, { FunctionComponent } from 'react';
import { isStepCompleted } from '@chess-tent/models';
import { ChessboardProps, ExerciseSteps } from '@types';
import { hooks } from '@application';
import { SegmentActivityProps } from '../../types';

const { useActivityMeta } = hooks;

const Playground: FunctionComponent<
  SegmentActivityProps<ExerciseSteps> & Partial<ChessboardProps>
> = ({ step, Chessboard, activity, ...props }) => {
  const [{ showHint }] = useActivityMeta(activity);
  const completed = isStepCompleted(activity, step);
  const activeSegment = completed
    ? step.state.explanation
    : showHint
    ? step.state.hint
    : step.state.task;
  const activeShapes =
    showHint && !completed
      ? [...(activeSegment.shapes || []), ...(step.state.hint.shapes || [])]
      : activeSegment.shapes;

  return (
    <Chessboard
      fen={step.state.task.position}
      autoShapes={activeShapes}
      animation
      {...props}
    />
  );
};

export default Playground;
