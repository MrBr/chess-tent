import React, { ComponentProps, FunctionComponent } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationStep,
  Move,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';
import { isCorrectActivityMove } from './utils';

const { Text } = ui;
const { LessonToolboxText } = components;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseVariationStep>['ActivitySidebar']>
> = ({ step, stepActivityState, activity }) => {
  const {
    activeMoveIndex,
    moves: activityMoves,
  } = stepActivityState as ExerciseVariationActivityState;
  const { explanation, task } = step.state;
  const moveToPlayIndex = activeMoveIndex ? activeMoveIndex + 1 : 0;
  const stepToPlayMove = task.moves?.[moveToPlayIndex];
  const activityActiveMove =
    activeMoveIndex !== undefined ? activityMoves?.[activeMoveIndex] : null;
  const isCorrectActiveMove = activityActiveMove?.move
    ? isCorrectActivityMove(
        activityActiveMove.move,
        stepToPlayMove?.move as Move,
      )
    : false;
  const completed = isStepCompleted(activity, step);
  return (
    <>
      <LessonToolboxText defaultText={task.text} />
      <Text>
        {isCorrectActiveMove
          ? 'Excellent, continue..'
          : !!activityActiveMove
          ? 'Wrong move, try again'
          : stepToPlayMove
          ? stepToPlayMove.piece?.color + ' to play'
          : 'Done!'}
      </Text>
      {completed && <LessonToolboxText defaultText={explanation?.text} />}
    </>
  );
};

export default Playground;
