import React from 'react';
import { ExerciseQuestionState, ExerciseToolboxProps } from '@types';
import { components } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';

const { LessonToolboxText } = components;

export default ({ step, updateStep }: ExerciseToolboxProps) => {
  const state = step.state.exerciseState as ExerciseQuestionState;
  const updateQuestion = useUpdateExerciseStateProp<ExerciseQuestionState>(
    updateStep,
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<ExerciseQuestionState>(
    updateStep,
    step,
    'explanation',
  );

  return (
    <>
      <LessonToolboxText
        defaultText={state.question}
        placeholder="Ask question.."
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
