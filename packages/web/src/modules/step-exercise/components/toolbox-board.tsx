import React from 'react';
import { ExerciseStep } from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp } from '../hooks';
import { BoardExerciseState } from '../model';

const { Text, Container } = ui;
const { LessonToolboxText, StepMove } = components;

export default ({ step }: { step: ExerciseStep }) => {
  const { question, explanation, moves, activeMoveIndex } = step.state
    .exerciseState as BoardExerciseState;
  const updateQuestion = useUpdateExerciseStateProp<BoardExerciseState>(
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<BoardExerciseState>(
    step,
    'explanation',
  );
  const updateActiveMoveIndex = useUpdateExerciseStateProp<BoardExerciseState>(
    step,
    'activeMoveIndex',
  );

  return (
    <>
      <LessonToolboxText
        defaultText={question}
        placeholder="The task.."
        onChange={updateQuestion}
      />
      <Container>
        <Text>Moves:</Text>
        <Text inline onClick={() => updateActiveMoveIndex(undefined)}>
          FEN
        </Text>
        {moves?.map((move, index) => (
          <Text
            inline
            weight={activeMoveIndex === index ? 700 : 500}
            onClick={() => updateActiveMoveIndex(index)}
            key={index}
          >
            <StepMove {...move} suffix=" " prefix=" " blackIndexSign=" " />
          </Text>
        ))}
      </Container>
      <LessonToolboxText
        defaultText={explanation}
        placeholder="Explanation.."
        onChange={updateExplanation}
      />
    </>
  );
};
