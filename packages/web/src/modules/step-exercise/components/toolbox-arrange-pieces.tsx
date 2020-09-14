import React from 'react';
import { ExerciseArrangePiecesState, ExerciseStep } from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp } from '../hooks';

const { LessonToolboxText } = components;
const { Container, Text } = ui;

export default ({ step }: { step: ExerciseStep }) => {
  const state = step.state.exerciseState as ExerciseArrangePiecesState;
  const updateQuestion = useUpdateExerciseStateProp<ExerciseArrangePiecesState>(
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<
    ExerciseArrangePiecesState
  >(step, 'explanation');

  return (
    <>
      <LessonToolboxText
        defaultText={state.question}
        placeholder="Describe what pieces to position.."
        onChange={updateQuestion}
      />
      <Container>
        {state.moves?.map(move => (
          <Text key={move.move?.[0]}>
            {move.move?.[0]} {move.move?.[1]}
          </Text>
        ))}
      </Container>
      <LessonToolboxText
        defaultText={state.explanation}
        placeholder="Write explanation.."
        onChange={updateExplanation}
      />
    </>
  );
};
