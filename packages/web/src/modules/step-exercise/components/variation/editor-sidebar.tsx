import React from 'react';
import { ExerciseToolboxProps, ExerciseVariationState } from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';

const { Text, Container } = ui;
const { LessonToolboxText, StepMove } = components;

export default ({ step, updateStep }: ExerciseToolboxProps) => {
  const { question, explanation, moves, activeMoveIndex } = step.state
    .exerciseState as ExerciseVariationState;
  const updateQuestion = useUpdateExerciseStateProp<ExerciseVariationState>(
    updateStep,
    step,
    'question',
  );
  const updateExplanation = useUpdateExerciseStateProp<ExerciseVariationState>(
    updateStep,
    step,
    'explanation',
  );
  const updateActiveMoveIndex = useUpdateExerciseStateProp<
    ExerciseVariationState
  >(updateStep, step, 'activeMoveIndex');

  return (
    <>
      <LessonToolboxText
        defaultText={question}
        placeholder="The task.."
        onChange={updateQuestion}
      />
      <Container className="p-0">
        <Text inline fontSize="small">
          Moves:{' '}
        </Text>
        <Text
          inline
          fontSize="small"
          onClick={() => updateActiveMoveIndex(undefined)}
        >
          FEN
        </Text>
        {moves?.map((move, index) => (
          <Text
            fontSize="small"
            inline
            weight={activeMoveIndex === index ? 700 : 500}
            onClick={() => updateActiveMoveIndex(index)}
            key={index}
          >
            <StepMove move={move} suffix=" " prefix=" " blackIndexSign=" " />
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