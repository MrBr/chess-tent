import React, { ComponentProps, FunctionComponent } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationState,
  Move,
} from '@types';
import { isCorrectActivityMove } from './utils';
import { isStepCompleted } from '@chess-tent/models';

const { Text } = ui;
const { LessonToolboxText } = components;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule['ActivitySidebar']>
> = ({ step, stepActivityState, activity }) => {
  const {
    activeMoveIndex,
    moves: activityMoves,
  } = stepActivityState as ExerciseVariationActivityState;
  const { moves: exerciseMoves, explanation, question } = step.state
    .exerciseState as ExerciseVariationState;
  const moveToPlayIndex = activeMoveIndex ? activeMoveIndex + 1 : 0;
  const stepToPlayMove = exerciseMoves?.[moveToPlayIndex];
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
      <LessonToolboxText defaultText={question} />
      <Text>
        {isCorrectActiveMove
          ? 'Excellent, continue..'
          : !!activityActiveMove
          ? 'Wrong move, try again'
          : stepToPlayMove
          ? stepToPlayMove.piece?.color + ' to play'
          : 'Done!'}
      </Text>
      {completed && <LessonToolboxText defaultText={explanation} />}
    </>
  );
};

export default Playground;
