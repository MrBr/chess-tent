import React from 'react';
import { ExerciseStep, ExerciseVariationState } from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp } from '../hooks';

const { Text, Container } = ui;
const { LessonToolboxText, StepMove } = components;

export default ({ step }: { step: ExerciseStep }) => {
  const { question, explanation, moves, activeMoveIndex } = step.state
    .exerciseState as ExerciseVariationState;
  const updateQuestion = useUpdateExerciseStateProp<ExerciseVariationState>(
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<ExerciseVariationState>(
    step,
    'explanation',
  );
  const updateActiveMoveIndex = useUpdateExerciseStateProp<
    ExerciseVariationState
  >(step, 'activeMoveIndex');

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
