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
  Shape,
} from '@types';
import { updateStepState } from '@chess-tent/models';
import { useUpdateExerciseState, useUpdateExerciseStateProp } from '../hooks';

const { Chessboard } = components;
const { createFenForward } = services;
const { ToggleButton } = ui;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
  updateStep,
}) => {
  const { position, shapes } = step.state;
  const { moves, editing } = step.state
    .exerciseState as ExerciseArrangePiecesState;
  const updateMoves = useUpdateExerciseStateProp<ExerciseArrangePiecesState>(
    updateStep,
    step,
    'moves',
  );
  const updateExerciseState = useUpdateExerciseState(updateStep, step);
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      updateStep(updateStepState(step, { shapes }));
    },
    [updateStep, step],
  );
  const handleMove = useCallback(
    (position, newMove, piece, captured) => {
      if (editing) {
        updateStep(updateStepState(step, { position }));
        updateMoves([]);
        return;
      }
      const movedPiecePrevMove = moves?.find(
        move => move.move?.[1] === newMove[0],
      );
      updateMoves([
        // Remove piece previous move
        ...(moves || []).filter(move => move !== movedPiecePrevMove),
        {
          move: [movedPiecePrevMove?.move?.[0] || newMove[0], newMove[1]],
          piece,
          captured,
        },
      ]);
    },
    [editing, moves, step, updateMoves, updateStep],
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
      onMove={handleMove}
      header={status}
      onShapesChange={handleShapes}
      shapes={shapes}
      footer={
        <ToggleButton
          value={1}
          checked
          size="extra-small"
          onChange={() => updateExerciseState({ editing: !editing })}
        >
          {editing ? 'Set position' : 'Edit board'}
        </ToggleButton>
      }
    />
  );
};

export default Editor;
