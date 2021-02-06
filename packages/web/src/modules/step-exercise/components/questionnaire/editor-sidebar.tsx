import React, { ReactEventHandler, useCallback } from 'react';
import { ExerciseQuestionnaireStep, ExerciseToolboxProps } from '@types';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';
import { SegmentSidebar } from '../segment';

const { Check, Row, Col, Text, Container } = ui;
const { LessonToolboxText } = components;

export default ({
  step,
  updateStep,
}: ExerciseToolboxProps<ExerciseQuestionnaireStep>) => {
  const updateTaskOptions = useUpdateExerciseStateProp(updateStep, step, [
    'task',
    'options',
  ]);

  const state = step.state.task;
  const addOption: ReactEventHandler = useCallback(
    event => {
      event.stopPropagation();
      updateTaskOptions([
        ...(state?.options || []),
        { text: '', correct: false },
      ]);
    },
    [state, updateTaskOptions],
  );

  const updateOption = (index: number, update: {}) => {
    const options = state?.options?.map((option, optionIndex) =>
      optionIndex === index ? { ...option, ...update } : option,
    );
    updateTaskOptions(options);
  };

  return (
    <SegmentSidebar step={step} updateStep={updateStep}>
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
    </SegmentSidebar>
  );
};
