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
  ExerciseVariationState,
} from '@types';
import { isCorrectActivityMove, isVariationCompleted } from './utils';

const { createFenForward } = services;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule['ActivityBoard']>
> = ({
  step,
  stepActivityState,
  setStepActivityState,
  Footer,
  Chessboard,
  completeStep,
}) => {
  const { position, shapes } = step.state;
  const {
    activeMoveIndex,
    moves: activityMoves,
  } = stepActivityState as ExerciseVariationActivityState;
  const { moves: exerciseMoves } = step.state
    .exerciseState as ExerciseVariationState;
  const moveToPlayIndex = activeMoveIndex ? activeMoveIndex + 1 : 0;
  const stepToPlayMove = exerciseMoves?.[moveToPlayIndex];
  const stepActiveMove = exerciseMoves?.[activeMoveIndex as number];
  const activeShapes = stepActiveMove ? stepActiveMove.shapes : shapes;
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
    <Chessboard
      fen={activePosition}
      onMove={handleMove}
      shapes={activeShapes}
      animation
      footer={<Footer />}
    />
  );
};

export default Playground;
