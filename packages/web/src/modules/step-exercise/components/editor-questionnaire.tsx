import React, { ComponentProps, FunctionComponent } from 'react';
import { components, hooks } from '@application';
import { ExerciseModule } from '@types';

const { Chessboard } = components;
const { useUpdateLessonStepState } = hooks;

const Editor: FunctionComponent<ComponentProps<ExerciseModule['Editor']>> = ({
  step,
  status,
  lesson,
  chapter,
}) => {
  const { position, shapes } = step.state;
  const updateStepState = useUpdateLessonStepState(lesson, chapter, step);
  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onMove={position => updateStepState({ position })}
      header={status}
      onShapesChange={shapes => updateStepState({ shapes })}
      shapes={shapes}
    />
  );
};

export default Editor;
