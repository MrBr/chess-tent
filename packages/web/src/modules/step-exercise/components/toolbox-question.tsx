import React from 'react';
import { ExerciseQuestionState, ExerciseStep } from '@types';
import { components } from '@application';
import { useUpdateExerciseStateProp } from '../hooks';

const { LessonToolboxText } = components;

export default ({ step }: { step: ExerciseStep }) => {
  const state = step.state.exerciseState as ExerciseQuestionState;
  const updateQuestion = useUpdateExerciseStateProp<ExerciseQuestionState>(
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<ExerciseQuestionState>(
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
