import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { services } from '@application';
import { ExerciseModule, Move, ExerciseArrangePiecesStep } from '@types';
import { useUpdateExerciseStateProp } from '../../hooks';
import { SegmentBoard } from '../segment';

const { createFenForward, createNotableMove } = services;

const Editor: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseArrangePiecesStep>['EditorBoard']>
> = ({ step, Chessboard, updateStep }) => {
  const { position, shapes, editing, moves } = step.state.task;
  const handleShapes = useUpdateExerciseStateProp(updateStep, step, [
    'task',
    'shapes',
  ]);
  const updateExerciseTask = useUpdateExerciseStateProp(
    updateStep,
    step,
    'task',
  );
  const handleChange = useCallback(
    (position, newMove?, piece?, captured?) => {
      if (editing || !newMove) {
        // editing: true - In case new piece is added or removed,
        // turning editing mode on (in case it isn't)
        updateExerciseTask({ moves: [], editing: true, position });
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
        captured,
        piece,
      );
      const newMoves: typeof moves = [
        // Remove piece previous move
        ...(moves || []).filter(move => move !== movedPiecePrevMove),
      ];
      if (!isBackMove) {
        newMoves.push(newNotableMove);
      }
      updateExerciseTask({ moves: newMoves });
    },
    [editing, moves, updateExerciseTask],
  );
  const activePosition = useMemo(
    () =>
      createFenForward(position, moves?.map(({ move }) => move as Move) || []),
    [position, moves],
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
          onPieceRemove={position => handleChange(position)}
          onPieceDrop={position => handleChange(position)}
          onShapesChange={handleShapes}
          shapes={shapes}
          onUpdateEditing={editing => updateExerciseTask({ editing })}
        />
      }
    ></SegmentBoard>
  );
};

export default Editor;
