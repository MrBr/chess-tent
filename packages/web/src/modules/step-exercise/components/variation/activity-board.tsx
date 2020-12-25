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
import { isCorrectActivityMove } from './utils';

const { createFenForward } = services;

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['ActivityBoard']
>> = ({
  step,
  stepActivityState,
  setStepActivityState,
  Footer,
  Chessboard,
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
      setStepActivityState({
        moves: {
          ...activityMoves,
          [moveToPlayIndex]: { move, piece, captured },
        },
        activeMoveIndex: isCorrectActivityMove(move, stepToPlayMove?.move)
          ? moveToPlayIndex + 1
          : moveToPlayIndex,
      });
    },
    [activityMoves, moveToPlayIndex, setStepActivityState, stepToPlayMove],
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
