import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { components, services } from '@application';
import {
  ExerciseModule,
  ExerciseArrangePiecesState,
  Move,
  Shape,
} from '@types';
import { useUpdateExerciseStep } from '../hooks';

const { Chessboard, EditBoardToggle } = components;
const { createFenForward, createNotableMove } = services;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
  updateStep,
}) => {
  const { position, shapes } = step.state;
  const { moves, editing } = step.state
    .exerciseState as ExerciseArrangePiecesState;
  const updateExerciseStep = useUpdateExerciseStep<ExerciseArrangePiecesState>(
    updateStep,
    step,
  );
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      updateExerciseStep({}, { shapes });
    },
    [updateExerciseStep],
  );
  const handleChange = useCallback(
    (position, newMove?, piece?, captured?) => {
      if (editing || !newMove) {
        // editing: true - In case new piece is added or removed,
        // turning editing mode on (in case it isn't)
        updateExerciseStep({ moves: [], editing: true }, { position });
        return;
      }
      const movedPiecePrevMove = moves?.find(
        move => move.move?.[1] === newMove[0],
      );
      const newMoves: typeof moves = [
        // Remove piece previous move
        ...(moves || []).filter(move => move !== movedPiecePrevMove),
        createNotableMove(
          position,
          [movedPiecePrevMove?.move?.[0] || newMove[0], newMove[1]],
          0,
          captured,
          piece,
        ),
      ];
      updateExerciseStep({ moves: newMoves });
    },
    [editing, moves, updateExerciseStep],
  );
  const activePosition = useMemo(
    () =>
      createFenForward(position, moves?.map(({ move }) => move as Move) || []),
    [position, moves],
  );

  return (
    <Chessboard
      edit
      sparePieces
      fen={activePosition}
      onMove={handleChange}
      onPieceRemove={position => handleChange(position)}
      onPieceDrop={position => handleChange(position)}
      header={status}
      onShapesChange={handleShapes}
      shapes={shapes}
      footer={
        <EditBoardToggle
          editing={!!editing}
          onChange={editing => updateExerciseStep({ editing })}
        />
      }
    />
  );
};

export default Editor;
