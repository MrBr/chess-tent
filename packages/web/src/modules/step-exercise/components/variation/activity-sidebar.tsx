import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationState,
  Move,
} from '@types';

const { Text } = ui;

const isCorrectActivityMove = (activityMove: Move, stepMove: Move) =>
  stepMove[0] === activityMove[0] && stepMove[1] === activityMove[1];

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['ActivitySidebar']
>> = ({ step, stepActivityState }) => {
  const {
    activeMoveIndex,
    moves: activityMoves,
  } = stepActivityState as ExerciseVariationActivityState;
  const { moves: exerciseMoves } = step.state
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
  return (
    <Text>
      {isCorrectActiveMove
        ? 'Excellent, continue..'
        : !!activityActiveMove
        ? 'Wrong move, try again'
        : stepToPlayMove
        ? stepToPlayMove.piece?.color + ' to play'
        : 'Done!'}
    </Text>
  );
};

export default Playground;
