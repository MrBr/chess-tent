import React, { useCallback } from 'react';
import { ExerciseQuestionnaireState, ExerciseToolboxProps } from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStep } from '../../hooks';

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

  return (
    <>
      <LessonToolboxText
        defaultText={state.question}
        placeholder="Ask question.."
      />
      <Container className="mt-2">
        {state?.options?.map(({ text, correct }, index) => (
          <Row key={index}>
            <Col xs={0}>
              <Check
                checked={correct}
                onChange={() => updateOption(index, { correct: !correct })}
              />
            </Col>
            <Col>
              <LessonToolboxText
                defaultText={text}
                onChange={text => updateOption(index, { text })}
              />
            </Col>
          </Row>
        ))}
      </Container>
      <Text onClick={addOption} fontSize="small">
        + Add option
      </Text>
      <LessonToolboxText
        defaultText={state.explanation}
        placeholder="Write explanation.."
      />
    </>
  );
};