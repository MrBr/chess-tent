import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationStep,
} from '@types';
import { isLessonActivityBoardStepCompleted } from '@chess-tent/models';
import { SegmentActivitySidebar } from '../segment';

const { Text } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseVariationStep>['ActivitySidebar']>
> = props => {
  const { boardState, step, stepActivityState, setStepActivityState } = props;
  const {
    activeMoveIndex,
    correct,
  } = stepActivityState as ExerciseVariationActivityState;
  const { task } = step.state;
  const moveToPlayIndex = activeMoveIndex || 0;
  const stepToPlayMove = task.moves?.[moveToPlayIndex];
  const completed = isLessonActivityBoardStepCompleted(boardState, step);

  const reset = () =>
    setStepActivityState({ move: null, activeMoveIndex: null, correct: null });

  return (
    <SegmentActivitySidebar title="Task" {...props} onReset={reset}>
      <Text>
        {correct && !completed
          ? 'Excellent, continue..'
          : correct === false
          ? 'Wrong move, try again'
          : stepToPlayMove
          ? stepToPlayMove.piece?.color + ' to play'
          : 'Done!'}
      </Text>
    </SegmentActivitySidebar>
  );
};

export default Playground;
