import React, { FunctionComponent, useCallback } from 'react';
import { services } from '@application';
import {
  ExerciseMove,
  ExerciseSegmentKeys,
  ExerciseVariationState,
  ExerciseVariationStep,
  FEN,
  Piece,
  Shape,
} from '@types';
import { SegmentBoardProps } from '../../types';
import { withSegments } from '../../hoc';
import { SegmentBoard } from '../segment';

const { getPiece, getTurnColor, setTurnColor, createNotableMove } = services;

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
): Partial<ExerciseVariationState['task']> => ({
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

const TaskBoard: FunctionComponent<
  SegmentBoardProps<ExerciseVariationStep, 'task'>
> = ({ step, Chessboard, updateSegment }) => {
  const { task } = step.state;
  const { editing, moves, activeMoveIndex, position } = task;
  const activeMove = moves?.[activeMoveIndex as number];

  const boardSetup = useCallback(
    (position: FEN) => {
      updateSegment({
        position,
        moves: [],
        shapes: [],
        activeMoveIndex: undefined,
        editing: true,
      });
    },
    [updateSegment],
  );

  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      if (activeMoveIndex === undefined) {
        return;
      }
      updateSegment({
        moves: updateMoveShapes(activeMoveIndex, moves, shapes),
      });
    },
    [activeMoveIndex, moves, updateSegment],
  );

  const handleChange = useCallback(
    (newPosition, move?, piece?: Piece, captured?) => {
      if (editing || !move || !piece) {
        // editing: true - In case new piece is added or removed,
        // turning editing mode on (in case it isn't)
        boardSetup(newPosition);
        return;
      }
      const currentIndex = activeMoveIndex === undefined ? -1 : activeMoveIndex;
      const prevMoves = removeOldLineMoves(currentIndex, moves);
      const moveIndex = resolveNextMoveIndex(piece, prevMoves);
      const updatedTask = addNewMove(
        {
          ...createNotableMove(newPosition, move, moveIndex, piece, captured),
          shapes: [],
        },
        prevMoves,
      );
      if (currentIndex === -1 && piece.color !== getTurnColor(position)) {
        // Updating base position FEN to match first move color
        updatedTask.position = setTurnColor(position, piece.color);
      }
      updateSegment(updatedTask);
    },
    [editing, moves, updateSegment, activeMoveIndex, position, boardSetup],
  );

  const activePosition = activeMove?.position || position;
  const activeShapes = activeMove?.shapes || [];

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
      allowAllMoves
      sparePieces
      fen={activePosition}
      onMove={handleChange}
      onPieceDrop={position => handleChange(position)}
      onPieceRemove={position => handleChange(position)}
      onReset={boardSetup}
      onClear={boardSetup}
      onFENSet={boardSetup}
      onShapesChange={handleShapes}
      shapes={activeShapes}
      validateMove={validateMove}
      editing={!!editing}
      onUpdateEditing={editing => updateSegment({ editing })}
    />
  );
};

export default withSegments<
  SegmentBoardProps<ExerciseVariationStep, ExerciseSegmentKeys>
>({
  task: TaskBoard,
  hint: SegmentBoard,
  explanation: SegmentBoard,
});
