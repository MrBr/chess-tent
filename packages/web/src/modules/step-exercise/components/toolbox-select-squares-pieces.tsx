import React from 'react';
import { ExerciseSelectSquaresAndPiecesState, ExerciseStep } from '@types';
import { components } from '@application';
import { useUpdateExerciseStateProp } from '../hooks';

const { LessonToolboxText } = components;

export default ({ step }: { step: ExerciseStep }) => {
  const state = step.state.exerciseState as ExerciseSelectSquaresAndPiecesState;
  const updateQuestion = useUpdateExerciseStateProp<
    ExerciseSelectSquaresAndPiecesState
  >(step, 'question');
  const updateExplanation = useUpdateExerciseStateProp<
    ExerciseSelectSquaresAndPiecesState
  >(step, 'explanation');

  return (
    <>
      <LessonToolboxText
        defaultText={state.question}
        placeholder="Describe what should user select.."
        onChange={updateQuestion}
      />
      <LessonToolboxText
        defaultText={state.explanation}
        placeholder="Write explanation.."
        onChange={updateExplanation}
      />
    </>
  );
};
