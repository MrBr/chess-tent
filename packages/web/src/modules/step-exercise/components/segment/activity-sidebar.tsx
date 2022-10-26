import React, { FunctionComponent, useCallback } from 'react';
import { ui, components } from '@application';
import { ExerciseSteps } from '@types';

import { SegmentActivityProps } from '../../types';
import { hasExplanation } from '../../service';

const { ToggleButton, Text, Row, Col, ButtonGroup } = ui;
const { LessonPlaygroundContent } = components;

const Playground: FunctionComponent<
  SegmentActivityProps<ExerciseSteps> & {
    title: string;
    onReset?: () => void;
    onSubmit?: () => void;
    onHint?: () => void;
  }
> = ({
  setStepActivityState,
  step,
  children,
  title,
  onReset,
  onHint,
  stepActivityState,
  onSubmit,
}) => {
  const { showHint, completed } = stepActivityState;
  const { task, explanation, hint } = step.state;
  const handleShowHint = useCallback(() => {
    setStepActivityState({ showHint: true });
  }, [setStepActivityState]);

  let segmentContent = task?.text;
  if (completed && hasExplanation(step)) {
    segmentContent = explanation?.text;
  } else if (showHint) {
    segmentContent = hint?.text;
  }

  return (
    <LessonPlaygroundContent>
      <Row className="align-items-center">
        <Col className="col-auto">
          <Text fontSize="smallest" weight={500} className="m-0">
            {title}
          </Text>
        </Col>
        <Col className="ms-auto col-auto">
          <ButtonGroup>
            {onSubmit && (
              <ToggleButton
                size="smallest"
                variant="tertiary"
                onClick={onSubmit}
              >
                <u>Submit</u>
              </ToggleButton>
            )}
            {onReset && (
              <ToggleButton
                size="smallest"
                variant="tertiary"
                onClick={onReset}
              >
                Reset
              </ToggleButton>
            )}
            {(onHint || handleShowHint) && (
              <ToggleButton
                size="smallest"
                variant="tertiary"
                onClick={onHint || handleShowHint}
                disabled={!onHint && !hint}
              >
                Hint
              </ToggleButton>
            )}
          </ButtonGroup>
        </Col>
      </Row>
      <Text className="m-0 mb-1" fontSize="smallest">
        {segmentContent}
      </Text>
      {children}
    </LessonPlaygroundContent>
  );
};

export default Playground;
