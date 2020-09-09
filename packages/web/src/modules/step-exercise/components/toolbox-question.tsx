import React from 'react';
import { ExerciseStep } from '@types';
import { components } from '@application';
import { useUpdateExerciseStateProp } from '../hooks';
import { QuestionExerciseState } from '../model';

const { LessonToolboxText } = components;

export default ({ step }: { step: ExerciseStep }) => {
  const state = step.state.exerciseState as QuestionExerciseState;
  const updateQuestion = useUpdateExerciseStateProp<QuestionExerciseState>(
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<QuestionExerciseState>(
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
