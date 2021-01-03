import React from 'react';
import { ExerciseToolboxProps, ExerciseVariationState } from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';

const { Text, Container, Row } = ui;
const { LessonToolboxText, StepMove, StepTag } = components;

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
  const updateActiveMoveIndex = useUpdateExerciseStateProp<ExerciseVariationState>(
    updateStep,
    step,
    'activeMoveIndex',
  );

  return (
    <>
      <LessonToolboxText
        defaultText={question}
        placeholder="Describe the task.."
        onChange={updateQuestion}
      />
      <Container className="p-0 mt-2">
        <Text fontSize="small">Moves:</Text>
        <Row className="align-items-center m-0">
          <StepTag
            active={activeMoveIndex === -1}
            collapse
            onClick={() => updateActiveMoveIndex(-1)}
          >
            <Text className="mb-0" fontSize="small" color="title">
              FEN
            </Text>
          </StepTag>
          {moves?.map((move, index) => (
            <StepTag
              active={activeMoveIndex === index}
              collapse
              onClick={() => updateActiveMoveIndex(index)}
              key={index}
            >
              <StepMove move={move} suffix=" " prefix=" " blackIndexSign=" " />
            </StepTag>
          ))}
        </Row>
      </Container>
      <LessonToolboxText
        defaultText={explanation}
        placeholder="Explanation.."
        onChange={updateExplanation}
      />
    </>
  );
};
