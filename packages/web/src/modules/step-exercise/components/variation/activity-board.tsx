import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationStep,
} from '@types';
import { services } from '@application';
import { isCorrectActivityMove, isVariationCompleted } from './utils';
import { SegmentActivityBoard } from '../segment';

const { createNotableMove } = services;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseVariationStep>['ActivityBoard']>
> = props => {
  const { step, stepActivityState, setStepActivityState, completeStep } = props;
  const { position } = step.state.task;
  const {
    activeMoveIndex,
    move,
    correct,
  } = stepActivityState as ExerciseVariationActivityState;
  const { moves } = step.state.task;
  const activePosition =
    (!correct && move?.position) ||
    (activeMoveIndex && moves
      ? moves[activeMoveIndex - 1]?.position
      : position);

  const handleMove = useCallback(
    (position, move, piece, captured, promoted) => {
      const moveToPlayIndex = activeMoveIndex || 0;
      const stepToPlayMove = moves?.[moveToPlayIndex];
      // TODO - promotion
      const correct = isCorrectActivityMove(move, stepToPlayMove?.move);
      const newActiveMoveIndex = correct
        ? moveToPlayIndex + 2
        : moveToPlayIndex;
      // Skipping next move from the variation as it's played by the "computer"
      const nextUserMove = moves?.[newActiveMoveIndex];
      console.log(newActiveMoveIndex, nextUserMove);
      if (!correct) {
        setTimeout(() => {
          setStepActivityState({
            move: null,
          });
        }, 400);
      }
      if (correct && isVariationCompleted(nextUserMove)) {
        completeStep(step);
      }

      console.log(correct, move, moves, moveToPlayIndex, activeMoveIndex);
      setStepActivityState({
        move: createNotableMove(
          position,
          move,
          moveToPlayIndex,
          captured,
          promoted,
        ),
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
