import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, hooks } from '@application';
import { ExerciseModule, Shape } from '@types';

const { Chessboard } = components;
const { useUpdateLessonStepState } = hooks;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
  chapter,
  lesson,
}) => {
  const { position, shapes } = step.state;
  const updateStepState = useUpdateLessonStepState(lesson, chapter, step);
  const handleShapes = useCallback(
    (shapes: Shape[]) => {
      updateStepState({ shapes });
    },
    [updateStepState],
  );
  const handleMove = useCallback(
    position => {
      updateStepState({ position });
    },
    [updateStepState],
  );

  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onMove={handleMove}
      header={status}
      onShapesChange={handleShapes}
      shapes={shapes}
    />
  );
};

export default Editor;
