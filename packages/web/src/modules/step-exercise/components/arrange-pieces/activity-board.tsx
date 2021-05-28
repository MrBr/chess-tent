import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
  ExerciseModule,
  ExerciseActivityArrangePiecesState,
  Key,
  ExerciseArrangePiecesStep,
} from '@types';
import { SegmentActivityBoard } from '../segment';

const isPieceToMove = (
  activityMoves: ExerciseActivityArrangePiecesState['moves'],
  exerciseMoves: ExerciseActivityArrangePiecesState['moves'],
  orig: Key,
): boolean =>
  !!exerciseMoves?.some(exerciseMove => exerciseMove.move?.[0] === orig) ||
  !!activityMoves?.some(activityMove => activityMove.move?.[1] === orig);

const isPieceOnRightPlace = (
  exerciseMoves: ExerciseActivityArrangePiecesState['moves'],
  orig: Key,
): boolean =>
  !!exerciseMoves?.some(exerciseMove => exerciseMove.move?.[1] === orig);

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseArrangePiecesStep>['ActivityBoard']>
> = props => {
  const { step, stepActivityState, setStepActivityState } = props;
  const { position, moves: exerciseMoves } = step.state.task;
  const {
    moves: activityMoves,
  } = stepActivityState as ExerciseActivityArrangePiecesState;
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
      const isPieceMoveable = isPieceToMove(activityMoves, exerciseMoves, orig);
      const isPieceCorrectlyPlaced = isPieceOnRightPlace(exerciseMoves, orig);
      const isValid = isPieceMoveable && !isPieceCorrectlyPlaced;
      setStepActivityState(isValid ? null : orig);
      return isValid;
    },
    [activityMoves, exerciseMoves, setStepActivityState],
  );

  return (
    <SegmentActivityBoard
      fen={activePosition}
      onMove={handleMove}
      validateMove={validateMove}
      allowAllMoves
      {...props}
    />
  );
};

export default Playground;
