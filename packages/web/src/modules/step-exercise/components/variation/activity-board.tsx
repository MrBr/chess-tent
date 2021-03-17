import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { services } from '@application';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationStep,
} from '@types';
import { isCorrectActivityMove, isVariationCompleted } from './utils';
import { SegmentActivityBoard } from '../segment';

const { createFenForward } = services;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseVariationStep>['ActivityBoard']>
> = props => {
  const { step, stepActivityState, setStepActivityState, completeStep } = props;
  const { position } = step.state.task;
  const {
    activeMoveIndex,
    moves: activityMoves,
  } = stepActivityState as ExerciseVariationActivityState;
  const { moves: exerciseMoves } = step.state.task;
  const moveToPlayIndex = activeMoveIndex ? activeMoveIndex + 1 : 0;
  const stepToPlayMove = exerciseMoves?.[moveToPlayIndex];
  const activeMoves = exerciseMoves?.map(
    (move, index) => activityMoves?.[index] || move,
  );
  const activePosition = useMemo(() => {
    return activeMoveIndex !== undefined && activeMoves
      ? createFenForward(
          position,
          activeMoves
            .slice(0, activeMoveIndex + 1)
            .map(notableMove => notableMove.move),
        )
      : position;
  }, [position, activeMoveIndex, activeMoves]);
  const handleMove = useCallback(
    (position, move, piece, captured) => {
      const correctMove = isCorrectActivityMove(move, stepToPlayMove?.move);
      const activeMoveIndex = correctMove
        ? moveToPlayIndex + 1
        : moveToPlayIndex;
      // Skipping next move from the variation as it's played by the "computer"
      const nextUSerMove = activeMoves?.[activeMoveIndex + 1];

      if (isVariationCompleted(correctMove, nextUSerMove)) {
        completeStep(step);
      }

      setStepActivityState({
        moves: {
          ...activityMoves,
          [moveToPlayIndex]: { move, piece, captured },
        },
        activeMoveIndex,
      });
    },
    [
      activeMoves,
      activityMoves,
      completeStep,
      moveToPlayIndex,
      setStepActivityState,
      step,
      stepToPlayMove,
    ],
  );

  return (
    <SegmentActivityBoard fen={activePosition} onMove={handleMove} {...props} />
  );
};

export default Playground;
