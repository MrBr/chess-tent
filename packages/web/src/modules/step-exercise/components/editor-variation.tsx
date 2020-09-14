import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { components, hooks, ui, services } from '@application';
import {
  ExerciseModule,
  ExerciseVariationState,
  Move,
  Piece,
  Shape,
} from '@types';
import { useUpdateExerciseState } from '../hooks';

const { Chessboard } = components;
const { createFenForward } = services;
const { useUpdateStepState } = hooks;
const { ToggleButton } = ui;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
}) => {
  const { position, shapes } = step.state;
  const { editing, moves, activeMoveIndex } = step.state
    .exerciseState as ExerciseVariationState;
  const activeMove = moves?.[activeMoveIndex as number];
  const updateExerciseState = useUpdateExerciseState<ExerciseVariationState>(
    step,
  );
  const updateStepState = useUpdateStepState(step);
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      if (activeMoveIndex) {
        updateExerciseState({
          moves: moves?.map((move, index) =>
            index === activeMoveIndex
              ? {
                  ...move,
                  shapes,
                }
              : move,
          ),
        });
      } else {
        updateStepState({ shapes });
      }
    },
    [activeMoveIndex, moves, updateExerciseState, updateStepState],
  );
  const handleMove = useCallback(
    (position, move, piece: Piece, captured) => {
      if (editing) {
        updateStepState({ position });
      } else {
        let moveIndex = moves?.[moves?.length - 1]?.index || 0;
        if (
          piece.color === 'white' ||
          (piece.color === 'black' && moveIndex === 0)
        ) {
          moveIndex += 1;
        }
        updateExerciseState({
          moves: [
            ...(moves || []),
            {
              move,
              captured,
              piece,
              index: moveIndex,
              shapes: [],
            },
          ],
          activeMoveIndex: moves?.length ? moves.length : 0,
        });
      }
    },
    [editing, moves, updateExerciseState, updateStepState],
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

  return (
    <Chessboard
      fen={activePosition}
      onMove={handleMove}
      header={status}
      onShapesChange={handleShapes}
      shapes={activeShapes}
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
