import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { components, services, ui } from '@application';
import {
  ExerciseModule,
  ExerciseArrangePiecesState,
  Move,
  ExerciseActivityArrangePiecesState,
} from '@types';

const { Chessboard, LessonPlayground } = components;
const { createFenForward } = services;
const { Text } = ui;

const getPieceStatus = (
  activityMoves?: ExerciseActivityArrangePiecesState['moves'],
  destMove?: Move,
) => {
  const move = activityMoves?.find(({ move }) => move?.[0] === destMove?.[0]);
  if (!move) {
    return 'Not moved';
  }
  return move.move?.[1] === destMove?.[1] ? 'Correct' : 'Wrong square';
};

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['Playground']
>> = ({ step, status, stepActivityState, setStepActivityState }) => {
  const { position, shapes } = step.state;
  const {
    moves: activityMoves,
  } = stepActivityState as ExerciseActivityArrangePiecesState;
  const { moves: exerciseMoves } = step.state
    .exerciseState as ExerciseArrangePiecesState;
  const activePosition = useMemo(
    () =>
      createFenForward(
        position,
        activityMoves?.map(({ move }) => move as Move) || [],
      ),
    [position, activityMoves],
  );
  const handleMove = useCallback(
    (position, newMove, piece, captured) => {
      const movedPiecePrevMove = activityMoves?.find(
        move => move.move?.[1] === newMove[0],
      );
      setStepActivityState({
        move: [
          // Remove piece previous move
          ...(activityMoves || []).filter(move => move !== movedPiecePrevMove),
          {
            move: [movedPiecePrevMove?.move?.[0] || newMove[0], newMove[1]],
            piece,
            captured,
          },
        ],
      });
    },
    [activityMoves, setStepActivityState],
  );

  return (
    <LessonPlayground
      board={
        <Chessboard
          fen={activePosition}
          onMove={handleMove}
          header={status}
          shapes={shapes}
          animation
        />
      }
      sidebar={
        <>
          {exerciseMoves?.map(({ move }) => (
            <Text>
              {move?.[0]} - {getPieceStatus(activityMoves, move)}
            </Text>
          ))}
        </>
      }
    />
  );
};

export default Playground;
