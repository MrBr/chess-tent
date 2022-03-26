import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationStep,
} from '@types';
import { services } from '@application';
import {
  getActivityPosition,
  isCorrectActivityMove,
  isVariationCompleted,
} from './utils';
import { SegmentActivityBoard } from '../segment';

const { createNotableMove } = services;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseVariationStep>['ActivityBoard']>
> = props => {
  const { step, stepActivityState, setStepActivityState, completeStep } = props;
  const { activeMoveIndex } =
    stepActivityState as ExerciseVariationActivityState;
  const { moves } = step.state.task;
  const activePosition = getActivityPosition(step, stepActivityState);

  const handleMove = useCallback(
    (position, move, piece, captured, promoted) => {
      const moveToPlayIndex = activeMoveIndex || 0;
      const notableMove = createNotableMove(
        position,
        move,
        moveToPlayIndex,
        captured,
        promoted,
      );
      const stepToPlayMove = moves?.[moveToPlayIndex];
      const correct = isCorrectActivityMove(notableMove, stepToPlayMove);
      const newActiveMoveIndex = correct
        ? moveToPlayIndex + 2
        : moveToPlayIndex;
      // Skipping next move from the variation as it's played by the "computer"
      const nextUserMove = moves?.[newActiveMoveIndex];

      if (!correct) {
        // Timeout is here for a reason
        // It makes figure move smoothly back after the wrong move
        // TODO - find a generic way for doing this?
        setTimeout(() => {
          setStepActivityState({
            move: null,
          });
        }, 400);
      }

      if (correct && isVariationCompleted(nextUserMove)) {
        completeStep(step);
      }

      setStepActivityState({
        move: notableMove,
        correct,
        activeMoveIndex: newActiveMoveIndex,
      });
    },
    [moves, completeStep, setStepActivityState, step, activeMoveIndex],
  );

  return (
    <SegmentActivityBoard
      fen={activePosition}
      onMove={handleMove}
      {...props}
      allowAllMoves={false}
    />
  );
};

export default Playground;
