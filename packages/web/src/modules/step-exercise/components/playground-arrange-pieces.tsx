import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useState,
} from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseArrangePiecesState,
  Move,
  ExerciseActivityArrangePiecesState,
  Key,
} from '@types';

const { LessonPlayground, LessonPlaygroundSidebar } = components;
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

const isPieceToMove = (
  exerciseMoves: ExerciseActivityArrangePiecesState['moves'],
  orig: Key,
): boolean =>
  !!exerciseMoves?.some(exerciseMove => exerciseMove.move?.[0] === orig);

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['Playground']
>> = ({
  step,
  stepActivityState,
  setStepActivityState,
  Footer,
  lesson,
  chapter,
  Chessboard,
}) => {
  const { position, shapes } = step.state;
  const {
    moves: activityMoves,
  } = stepActivityState as ExerciseActivityArrangePiecesState;
  const [invalidPiece, setInvalidMove] = useState<Key | null>(null);
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
      setInvalidMove(isValid ? null : orig);
      return isValid;
    },
    [exerciseMoves],
  );

  return (
    <LessonPlayground
      board={
        <Chessboard
          fen={activePosition}
          onMove={handleMove}
          shapes={shapes}
          validateMove={validateMove}
          animation
          footer={<Footer />}
          edit
        />
      }
      sidebar={
        <LessonPlaygroundSidebar lesson={lesson} step={step} chapter={chapter}>
          {exerciseMoves?.map(({ move }) => (
            <Text key={move[0]}>
              {move[0]} - {getPieceStatus(activityMoves, move)}
            </Text>
          ))}
          {invalidPiece && (
            <Text fontSize="small">{invalidPiece} shouldn't be moved</Text>
          )}
        </LessonPlaygroundSidebar>
      }
    />
  );
};

export default Playground;
