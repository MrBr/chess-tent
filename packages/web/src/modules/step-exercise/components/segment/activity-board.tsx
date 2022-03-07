import React, { FunctionComponent } from 'react';
import { isLessonActivityBoardStepCompleted } from '@chess-tent/models';
import { ChessboardProps, ExerciseSteps } from '@types';
import { SegmentActivityProps } from '../../types';

const Playground: FunctionComponent<
  SegmentActivityProps<ExerciseSteps> & Partial<ChessboardProps>
> = ({ step, Chessboard, stepActivityState, boardState, ...props }) => {
  const { showHint } = stepActivityState;
  const completed = isLessonActivityBoardStepCompleted(boardState, step);
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
