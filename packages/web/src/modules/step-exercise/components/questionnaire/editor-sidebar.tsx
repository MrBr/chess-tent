import React, { ReactEventHandler, useCallback } from 'react';
import { ExerciseQuestionnaireStep } from '@types';
import { components, ui, utils } from '@application';
import { SegmentSidebar } from '../segment';
import { withSegmentSidebars } from '../../hoc';
import { SegmentToolboxProps } from '../../types';

const { Check, Row, Col, Container, Icon, Button } = ui;
const { LessonToolboxText } = components;

const TaskSidebar = (
  props: SegmentToolboxProps<ExerciseQuestionnaireStep, 'task'>,
) => {
  const { step, updateSegment } = props;

  const state = step.state.task;
  const addOption: ReactEventHandler = useCallback(
    event => {
      // Used to prevent other actions such as activeSegment from dispatching
      event.stopPropagation();
      updateSegment({
        options: [
          ...(state?.options || []),
          { id: utils.generateIndex(), text: '', correct: false },
        ],
      });
    },
    [state, updateSegment],
  );

  const removeOption = useCallback(
    (id: string, event: React.SyntheticEvent<Element, Event>) => {
      event.stopPropagation();
      const options = state?.options?.filter(option => option.id !== id);
      updateSegment({ options });
    },
    [state, updateSegment],
  );

  const updateOption = (id: string, update: {}) => {
    const options = state?.options?.map(option =>
      option.id === id ? { ...option, ...update } : option,
    );
    updateSegment({ options });
  };

  return (
    <SegmentSidebar {...props}>
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
                text={text}
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
      <Row>
        <Col>
          <Button
            onClick={addOption}
            size="extra-small"
            className="mt-2"
            variant="ghost"
          >
            + Add option
          </Button>
        </Col>
      </Row>
    </SegmentSidebar>
  );
};

export default withSegmentSidebars<ExerciseQuestionnaireStep>({
  task: TaskSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
