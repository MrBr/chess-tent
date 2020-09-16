import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { components, services } from '@application';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationState,
  Move,
} from '@types';

const { Chessboard, LessonPlayground } = components;
const { createFenForward } = services;

const isCorrectActivityMove = (activityMove: Move, stepMove: Move) =>
  stepMove[0] === activityMove[0] && stepMove[1] === activityMove[1];

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['Playground']
>> = ({ step, status, stepActivityState, setStepActivityState, Footer }) => {
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
  const activityActiveMove =
    activeMoveIndex !== undefined ? activityMoves?.[activeMoveIndex] : null;
  const isCorrectActiveMove = activityActiveMove?.move
    ? isCorrectActivityMove(
        activityActiveMove.move,
        stepToPlayMove?.move as Move,
      )
    : false;
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
            .map(notableMove => notableMove.move as Move),
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
        activeMoveIndex: isCorrectActivityMove(
          move,
          stepToPlayMove?.move as Move,
        )
          ? moveToPlayIndex + 1
          : moveToPlayIndex,
      });
    },
    [activityMoves, moveToPlayIndex, setStepActivityState, stepToPlayMove],
  );

  return (
    <LessonPlayground
      board={
        <Chessboard
          fen={activePosition}
          onMove={handleMove}
          header={status}
          shapes={activeShapes}
          animation
          footer={<Footer />}
        />
      }
      sidebar={
        <>
          {isCorrectActiveMove
            ? 'Excellent, continue..'
            : !!activityActiveMove
            ? 'Wrong move, try again'
            : stepToPlayMove
            ? stepToPlayMove.piece?.color + ' to play'
            : 'Done!'}
        </>
      }
    />
  );
};

export default Playground;
