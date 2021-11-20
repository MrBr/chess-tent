import React, { FunctionComponent } from 'react';
import { isStepCompleted } from '@chess-tent/models';
import { ChessboardProps } from '@types';
import { hooks } from '@application';
import { SegmentActivityProps } from '../../types';

const { useActivityMeta } = hooks;

const Playground: FunctionComponent<
  SegmentActivityProps & Partial<ChessboardProps>
> = ({ step, Chessboard, activity, stepActivityState, ...props }) => {
  const [{ showHint }] = useActivityMeta(activity);
  const completed = isStepCompleted(activity, step);
  const activeSegment = completed
    ? step.state.explanation
    : showHint
    ? step.state.hint
    : step.state.task;

  return (
    <Chessboard
      fen={activeSegment?.position || step.state.task.position}
      shapes={activeSegment?.shapes}
      animation
      {...props}
    />
  );
};

export default Playground;
