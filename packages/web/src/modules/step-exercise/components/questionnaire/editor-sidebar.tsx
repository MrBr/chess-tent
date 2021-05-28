import React, { ReactEventHandler, useCallback } from 'react';
import { ExerciseQuestionnaireStep, ExerciseToolboxProps } from '@types';
import { components, ui, utils } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';
import { SegmentSidebar } from '../segment';

const { Check, Row, Col, Text, Container, Icon } = ui;
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
      // Used to prevent other actions such as activeSegment from dispatching
      event.stopPropagation();
      updateTaskOptions([
        ...(state?.options || []),
        { id: utils.generateIndex(), text: '', correct: false },
      ]);
    },
    [state, updateTaskOptions],
  );

  const removeOption = useCallback(
    (id: string, event: React.SyntheticEvent<Element, Event>) => {
      event.stopPropagation();
      const options = state?.options?.filter(option => option.id !== id);
      updateTaskOptions(options);
    },
    [state, updateTaskOptions],
  );

  const updateOption = (id: string, update: {}) => {
    const options = state?.options?.map(option =>
      option.id === id ? { ...option, ...update } : option,
    );
    updateTaskOptions(options);
  };

  return (
    <SegmentSidebar step={step} updateStep={updateStep}>
      <Container className="mt-2">
        {state?.options?.map(({ id, text, correct }, index) => (
          <Row key={id} className="align-items-center">
            <Col className="pr-0 pl-0 col-auto">
              <Check
                checked={correct}
                onChange={() => updateOption(id, { correct: !correct })}
              />
            </Col>
            <Col className="d-flex align-items-center pl-0">
              <LessonToolboxText
                defaultText={text}
                placeholder="Type option..."
                onChange={text => updateOption(id, { text })}
              />
              {index !== state?.options?.length && (
                <Icon
                  type="close"
                  size="extra-small"
                  onClick={event => removeOption(id, event)}
                  textual
                />
              )}
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
