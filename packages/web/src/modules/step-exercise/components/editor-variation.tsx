import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { components, services } from '@application';
import {
  ExerciseModule,
  ExerciseMove,
  ExerciseStepState,
  ExerciseVariationState,
  Move,
  Piece,
  Shape,
} from '@types';
import { useUpdateExerciseStep } from '../hooks';

const { Chessboard, EditBoardToggle } = components;
const { createFenForward, getPiece, getTurnColor, setTurnColor } = services;

const updateMoveShapes = (
  moveIndex: number,
  moves: ExerciseMove[] = [],
  shapes: Shape[],
): ExerciseMove[] =>
  moves.map((move, index) =>
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
  updateStep,
}) => {
  const { position, shapes } = step.state;
  const { editing, moves, activeMoveIndex } = step.state
    .exerciseState as ExerciseVariationState;
  const activeMove = moves?.[activeMoveIndex as number];
  const updateExerciseStep = useUpdateExerciseStep<ExerciseVariationState>(
    updateStep,
    step,
  );
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      if (activeMoveIndex) {
        updateExerciseStep({
          moves: updateMoveShapes(activeMoveIndex, moves, shapes),
        });
      } else {
        updateExerciseStep({}, { shapes });
      }
    },
    [activeMoveIndex, moves, updateExerciseStep],
  );
  const handleMove = useCallback(
    (newPosition, move, piece: Piece, captured) => {
      if (editing) {
        updateExerciseStep({ moves: [] }, { position: newPosition });
        return;
      }
      const currentIndex = activeMoveIndex === undefined ? -1 : activeMoveIndex;
      const updatedStepState = {} as ExerciseStepState;
      if (currentIndex === -1 && piece.color !== getTurnColor(position)) {
        // Updating base position FEN to match first move color
        updatedStepState.position = setTurnColor(position, piece.color);
      }
      const prevMoves = removeOldLineMoves(currentIndex, moves);
      const moveIndex = resolveNextMoveIndex(piece, prevMoves);
      const updatedExerciseState = addNewMove(
        {
          move,
          captured,
          piece,
          index: moveIndex,
          shapes: [],
        },
        prevMoves,
      );
      updateExerciseStep(updatedExerciseState, updatedStepState);
    },
    [editing, moves, updateExerciseStep, activeMoveIndex, position],
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
      if (editing) {
        return true;
      }
      const piece = getPiece(activePosition, orig);
      return activeMove?.piece?.color !== piece?.color;
    },
    [activePosition, activeMove, editing],
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
          <EditBoardToggle
            onChange={editing => updateExerciseStep({ editing })}
            editing={!!editing}
          />
        </>
      }
    />
  );
};

export default Editor;
