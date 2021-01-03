import React, { useCallback } from 'react';
import {
  ExerciseQuestionnaireState,
  ExerciseQuestionState,
  ExerciseToolboxProps,
} from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp, useUpdateExerciseStep } from '../../hooks';

const { Check, Row, Col, Text, Container } = ui;
const { LessonToolboxText } = components;

export default ({ step, updateStep }: ExerciseToolboxProps) => {
  const state = step.state.exerciseState as ExerciseQuestionnaireState;
  const updateExerciseStep = useUpdateExerciseStep(updateStep, step);
  const addOption = useCallback(() => {
    updateExerciseStep({
      options: [...(state?.options || []), { text: '', correct: false }],
    });
  }, [state, updateExerciseStep]);

  const updateOption = (index: number, update: {}) => {
    const options = state?.options?.map((option, optionIndex) =>
      optionIndex === index ? { ...option, ...update } : option,
    );
    updateExerciseStep({ options });
  };
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
        className="mt-2"
      />
      <Container className="mt-2">
        {state?.options?.map(({ text, correct }, index) => (
          <Row key={index} className="align-items-center">
            <Col className="pr-0 pl-0 col-auto">
              <Check
                checked={correct}
                onChange={() => updateOption(index, { correct: !correct })}
              />
            </Col>
            <Col className="pl-0">
              <LessonToolboxText
                defaultText={text}
                placeholder="Type option.."
                onChange={text => updateOption(index, { text })}
              />
            </Col>
          </Row>
        ))}
      </Container>
      <Text onClick={addOption} fontSize="small" className="mt-2">
        + Add option
      </Text>
      <LessonToolboxText
        defaultText={state.explanation}
        placeholder="Write explanation.."
        onChange={updateExplanation}
        className="mt-2"
      />
    </>
  );
};
