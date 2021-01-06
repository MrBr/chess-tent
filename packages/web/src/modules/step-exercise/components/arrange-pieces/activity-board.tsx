import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
  ExerciseModule,
  ExerciseArrangePiecesState,
  ExerciseActivityArrangePiecesState,
  Key,
} from '@types';

const isPieceToMove = (
  exerciseMoves: ExerciseActivityArrangePiecesState['moves'],
  orig: Key,
): boolean =>
  !!exerciseMoves?.some(exerciseMove => exerciseMove.move?.[0] === orig);

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule['ActivityBoard']>
> = ({ step, stepActivityState, setStepActivityState, Footer, Chessboard }) => {
  const { position, shapes } = step.state;
  const {
    moves: activityMoves,
  } = stepActivityState as ExerciseActivityArrangePiecesState;
  const { moves: exerciseMoves } = step.state
    .exerciseState as ExerciseArrangePiecesState;
  const activePosition = activityMoves
    ? activityMoves[activityMoves.length - 1].position
    : position;
  const handleMove = useCallback(
    (position, newMove, piece, captured) => {
      const movedPiecePrevMove = activityMoves?.find(
        move => move.move?.[1] === newMove[0],
      );
      setStepActivityState({
        moves: [
          // Remove piece previous move
          ...(activityMoves || []).filter(move => move !== movedPiecePrevMove),
          {
            // If piece is moved multiple times, use initial square
            move: [movedPiecePrevMove?.move?.[0] || newMove[0], newMove[1]],
            piece,
            captured,
            position,
          },
        ],
      });
    },
    [activityMoves, setStepActivityState],
  );

  const validateMove = useCallback(
    orig => {
      const isValid = isPieceToMove(exerciseMoves, orig);
      setStepActivityState(isValid ? null : orig);
      return isValid;
    },
    [exerciseMoves, setStepActivityState],
  );

  return (
    <Chessboard
      fen={activePosition}
      onMove={handleMove}
      shapes={shapes}
      validateMove={validateMove}
      animation
      footer={<Footer />}
      allowAllMoves
    />
  );
};

export default Playground;
