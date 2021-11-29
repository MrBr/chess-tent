import React, { FunctionComponent, useCallback } from 'react';
import { services } from '@application';
import {
  ExerciseMove,
  ExerciseVariationState,
  ExerciseVariationStep,
  FEN,
  Piece,
  Shape,
} from '@types';
import { SegmentBoardProps } from '../../types';
import { withSegmentBoards } from '../../hoc';
import { SegmentBoard } from '../segment';
import { isFENSetup } from './utils';

const { getPiece, getTurnColor, setTurnColor, createNotableMove } = services;

const updateMoveShapes = (
  moveIndex: number | undefined | null,
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
  activeMoveIndex: moves?.length ? moves.length - 1 : 0,
});

const resolveNextMoveIndex = (piece: Piece, moves?: ExerciseMove[]) => {
  let index = moves?.[moves?.length - 1]?.index || 0;
  if (piece.color === 'white' || (piece.color === 'black' && index === 0)) {
    index += 1;
  }
  return index;
};

const removeOldLineMoves = (
  index: number | undefined | null,
  moves?: ExerciseMove[],
) => {
  if (isFENSetup(index)) {
    return [];
  }
  return moves && index < moves.length - 1
    ? moves.slice(0, moves.length - (moves.length - index) + 1)
    : moves;
};

const getActiveMove = (step: ExerciseVariationStep) => {
  const { task } = step.state;
  const { moves, activeMoveIndex } = task;
  return moves?.[activeMoveIndex as number];
};

const getActivePosition = (step: ExerciseVariationStep) => {
  const { task } = step.state;
  const { moves, activeMoveIndex, position } = task;
  const activeMove = moves?.[activeMoveIndex as number];
  return activeMove?.position || position;
};

const TaskBoard: FunctionComponent<
  SegmentBoardProps<ExerciseVariationStep, 'task'>
> = ({ step, Chessboard, updateSegment }) => {
  const { task } = step.state;
  const { editing, moves, activeMoveIndex, position } = task;
  const activeMove = getActiveMove(step);

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
    (newPosition, move?, piece?: Piece, captured?, promoted?) => {
      if (editing || !move || !piece) {
        // editing: true - In case new piece is added or removed,
        // turning editing mode on (in case it isn't)
        boardSetup(newPosition);
        return;
      }
      const prevMoves = removeOldLineMoves(activeMoveIndex, moves);
      const moveIndex = resolveNextMoveIndex(piece, prevMoves);
      const notableMove = createNotableMove(
        newPosition,
        move,
        moveIndex,
        piece,
        captured,
        promoted,
      );
      const updatedTask = addNewMove(
        {
          ...notableMove,
          shapes: [],
        },
        prevMoves,
      );
      if (
        activeMoveIndex === undefined &&
        piece.color !== getTurnColor(position)
      ) {
        // Updating base position FEN to match first move color
        updatedTask.position = setTurnColor(position, piece.color);
      }
      updatedTask.activeMoveIndex = activeMoveIndex ? activeMoveIndex + 1 : 0;
      updateSegment(updatedTask);
    },
    [editing, moves, updateSegment, activeMoveIndex, position, boardSetup],
  );

  const activePosition = getActivePosition(step);
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

const VariationSegmentBoard = (
  props: SegmentBoardProps<ExerciseVariationStep>,
) => {
  const activePosition = getActivePosition(props.step);
  return <SegmentBoard {...props} position={activePosition} />;
};

export default withSegmentBoards<ExerciseVariationStep>({
  task: TaskBoard,
  hint: VariationSegmentBoard,
  explanation: VariationSegmentBoard,
});
