import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { services } from '@application';
import {
  Move,
  ExerciseArrangePiecesStep,
  Shape,
  FEN,
  NotableMove,
} from '@types';
import { SegmentBoard } from '../segment';
import { withSegmentBoards } from '../../hoc';
import { SegmentBoardProps } from '../../types';

const { createFenForward, createNotableMove } = services;

const getActivePosition = (position: FEN, moves?: NotableMove[]) =>
  createFenForward(position, moves?.map(({ move }) => move as Move) || []);

const TaskBoard: FunctionComponent<
  SegmentBoardProps<ExerciseArrangePiecesStep, 'task'>
> = ({ Chessboard, updateSegment, segment }) => {
  const { position, editing, moves, shapes } = segment;

  const handleShapes = (shapes: Shape[]) => updateSegment({ shapes });

  const boardSetup = useCallback(
    (position: FEN) => {
      updateSegment({
        position,
        moves: [],
        shapes: [],
        editing: true,
      });
    },
    [updateSegment],
  );

  const handleChange = useCallback(
    (position, newMove?, piece?, captured?, promoted?) => {
      if (editing || !newMove) {
        // editing: true - In case new piece is added or removed,
        // turning editing mode on (in case it isn't)
        boardSetup(position);
        return;
      }
      const movedPiecePrevMove = moves?.find(
        move => move.move?.[1] === newMove[0],
      );
      const newMoveTest = [
        movedPiecePrevMove?.move?.[0] || newMove[0],
        newMove[1],
      ] as Move;
      const isBackMove = newMoveTest[0] === newMoveTest[1];
      const newNotableMove = createNotableMove(
        position,
        newMoveTest,
        0,
        piece,
        captured,
        promoted,
      );
      const newMoves: typeof moves = [
        // Remove piece previous move
        ...(moves || []).filter(move => move !== movedPiecePrevMove),
      ];
      if (!isBackMove) {
        newMoves.push(newNotableMove);
      }
      updateSegment({ moves: newMoves });
    },
    [editing, moves, updateSegment, boardSetup],
  );

  const activePosition = useMemo(() => getActivePosition(position, moves), [
    position,
    moves,
  ]);

  return (
    <Chessboard
      allowAllMoves
      sparePieces
      fen={activePosition}
      onMove={handleChange}
      onPieceRemove={position => handleChange(position)}
      onPieceDrop={position => handleChange(position)}
      onShapesChange={handleShapes}
      shapes={shapes}
      editing={!!editing}
      onUpdateEditing={editing => updateSegment({ editing })}
      onReset={boardSetup}
      onClear={boardSetup}
      onFENSet={boardSetup}
    />
  );
};

const ArrangePiecesSegmentBoard = (
  props: SegmentBoardProps<ExerciseArrangePiecesStep>,
) => {
  const { moves, position } = props.step.state.task;
  const activePosition = useMemo(() => getActivePosition(position, moves), [
    position,
    moves,
  ]);
  return <SegmentBoard {...props} position={activePosition} />;
};

export default withSegmentBoards<ExerciseArrangePiecesStep>({
  task: TaskBoard,
  explanation: ArrangePiecesSegmentBoard,
  hint: ArrangePiecesSegmentBoard,
});
