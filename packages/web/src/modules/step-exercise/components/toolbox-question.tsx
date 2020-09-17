import React from 'react';
import { ExerciseQuestionState, ExerciseToolboxProps } from '@types';
import { components } from '@application';
import { useUpdateExerciseStateProp } from '../hooks';

const { LessonToolboxText } = components;

export default ({ lesson, chapter, step }: ExerciseToolboxProps) => {
  const state = step.state.exerciseState as ExerciseQuestionState;
  const updateQuestion = useUpdateExerciseStateProp<ExerciseQuestionState>(
    lesson,
    chapter,
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<ExerciseQuestionState>(
    lesson,
    chapter,
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
