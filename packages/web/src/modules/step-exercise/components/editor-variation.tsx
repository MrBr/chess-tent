import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { components, hooks, ui, services } from '@application';
import {
  ExerciseModule,
  ExerciseMove,
  ExerciseVariationState,
  Move,
  NotableMove,
  Piece,
  Shape,
} from '@types';
import { useUpdateExerciseState } from '../hooks';

const { Chessboard } = components;
const { createFenForward, getPiece, getTurnColor, setTurnColor } = services;
const { useUpdateLessonStepState } = hooks;
const { ToggleButton } = ui;

const updateMoveShapes = (
  moveIndex: number,
  moves: NotableMove[] | undefined,
  shapes: Shape[],
) =>
  moves?.map((move, index) =>
    index === moveIndex
      ? {
          ...move,
          shapes,
        }
      : move,
  );

const addNewMove = (
  newMove: ExerciseMove,
  moves?: ExerciseMove[],
): Partial<ExerciseVariationState> => ({
  moves: [...(moves || []), newMove],
  activeMoveIndex: moves?.length ? moves.length : 0,
});

const resolveNextMoveIndex = (piece: Piece, moves?: ExerciseMove[]) => {
  let index = moves?.[moves?.length - 1]?.index || 0;
  if (piece.color === 'white' || (piece.color === 'black' && index === 0)) {
    index += 1;
  }
  return index;
};

const removeOldLineMoves = (index: number, moves?: ExerciseMove[]) =>
  moves && index < moves.length - 1
    ? moves.slice(0, moves.length - (moves.length - index) + 1)
    : moves;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
  chapter,
  lesson,
}) => {
  const { position, shapes } = step.state;
  const { editing, moves, activeMoveIndex } = step.state
    .exerciseState as ExerciseVariationState;
  const activeMove = moves?.[activeMoveIndex as number];
  const updateExerciseState = useUpdateExerciseState<ExerciseVariationState>(
    lesson,
    chapter,
    step,
  );
  const updateStepState = useUpdateLessonStepState(lesson, chapter, step);
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      if (activeMoveIndex) {
        updateExerciseState({
          moves: updateMoveShapes(activeMoveIndex, moves, shapes),
        });
      } else {
        updateStepState({ shapes });
      }
    },
    [activeMoveIndex, moves, updateExerciseState, updateStepState],
  );
  const handleMove = useCallback(
    (newPosition, move, piece: Piece, captured) => {
      if (editing) {
        updateStepState({ position: newPosition });
        updateExerciseState({ moves: [] });
        return;
      }
      const currentIndex = activeMoveIndex === undefined ? -1 : activeMoveIndex;
      if (currentIndex === -1 && piece.color !== getTurnColor(position)) {
        // Updating base position FEN to match first move color
        updateStepState({ position: setTurnColor(position, piece.color) });
      }
      const prevMoves = removeOldLineMoves(currentIndex, moves);
      const moveIndex = resolveNextMoveIndex(piece, prevMoves);
      updateExerciseState(
        addNewMove(
          {
            move,
            captured,
            piece,
            index: moveIndex,
            shapes: [],
          },
          prevMoves,
        ),
      );
    },
    [
      editing,
      moves,
      updateExerciseState,
      updateStepState,
      activeMoveIndex,
      position,
    ],
  );

  const activePosition = useMemo(() => {
    return activeMoveIndex !== undefined && moves
      ? createFenForward(
          position,
          moves
            .slice(0, activeMoveIndex + 1)
            .map(notableMove => notableMove.move as Move),
        )
      : position;
  }, [position, activeMoveIndex, moves]);
  const activeShapes = activeMove ? activeMove.shapes : shapes;

  const validateMove = useCallback(
    orig => {
      const piece = getPiece(activePosition, orig);
      return activeMove?.piece?.color !== piece?.color;
    },
    [activePosition, activeMove],
  );

  return (
    <Chessboard
      edit
      sparePieces
      fen={activePosition}
      onMove={handleMove}
      header={status}
      onShapesChange={handleShapes}
      shapes={activeShapes}
      validateMove={validateMove}
      footer={
        <>
          <ToggleButton
            value={1}
            checked
            size="extra-small"
            onChange={() => updateExerciseState({ editing: !editing })}
          >
            {editing ? 'Set position' : 'Edit board'}
          </ToggleButton>
        </>
      }
    />
  );
};

export default Editor;
