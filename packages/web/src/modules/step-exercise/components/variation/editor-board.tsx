import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { services } from '@application';
import {
  ExerciseModule,
  ExerciseMove,
  ExerciseVariationState,
  ExerciseVariationStep,
  Piece,
  Shape,
} from '@types';
import { useUpdateExerciseStateProp } from '../../hooks';
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

const EditorBoard: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseVariationStep>['EditorBoard']>
> = ({ step, Chessboard, updateStep }) => {
  const { task, activeSegment } = step.state;
  const { editing, moves, activeMoveIndex, position } = task;
  const segment = step.state[activeSegment];
  const activeMove = moves?.[activeMoveIndex as number];
  const updateExerciseTask = useUpdateExerciseStateProp(
    updateStep,
    step,
    'task',
  );
  const updateShapes = useUpdateExerciseStateProp(updateStep, step, [
    activeSegment,
    'shapes',
  ]);
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      const isTaskActiveSegment = activeSegment === 'task';
      if (isTaskActiveSegment && activeMoveIndex !== undefined) {
        updateExerciseTask({
          moves: updateMoveShapes(activeMoveIndex, moves, shapes),
        });
      } else {
        updateShapes(shapes);
      }
    },
    [activeMoveIndex, activeSegment, moves, updateExerciseTask, updateShapes],
  );
  const handleChange = useCallback(
    (newPosition, move?, piece?: Piece, captured?) => {
      if (editing || !move || !piece) {
        // editing: true - In case new piece is added or removed,
        // turning editing mode on (in case it isn't)
        updateExerciseTask({ moves: [], editing: true, position: newPosition });
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
      updateExerciseTask(updatedTask);
    },
    [editing, moves, updateExerciseTask, activeMoveIndex, position],
  );

  const activePosition = activeMove?.position || position;
  const activeShapes = activeMove
    ? activeMove.shapes || []
    : segment?.shapes || [];

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
    <SegmentBoard
      step={step}
      updateStep={updateStep}
      Chessboard={Chessboard}
      task={
        <Chessboard
          allowAllMoves
          sparePieces
          fen={activePosition}
          onMove={handleChange}
          onPieceDrop={position => handleChange(position)}
          onPieceRemove={position => handleChange(position)}
          onShapesChange={handleShapes}
          shapes={activeShapes}
          validateMove={validateMove}
          editing={!!editing}
          onUpdateEditing={editing => updateExerciseTask({ editing })}
        />
      }
    />
  );
};

export default EditorBoard;
