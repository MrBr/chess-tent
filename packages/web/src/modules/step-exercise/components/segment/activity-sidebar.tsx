import React, { FunctionComponent, useCallback } from 'react';
import { ui, components } from '@application';
import { ExerciseSteps } from '@types';

import { SegmentActivityProps } from '../../types';
import { hasExplanation } from '../../service';
import { isActivityStepSolving } from '../../../lesson/service';

const { Button, Text, Row, Col, Icon } = ui;
const { LessonPlaygroundCard, LessonPlaygroundStepTag } = components;

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
  const isActive = isActivityStepSolving(stepActivityState);
  const handleShowHint = useCallback(() => {
    setStepActivityState({ showHint: true });
  }, [setStepActivityState]);

  return (
    <>
      <LessonPlaygroundCard active={isActive}>
        <Row>
          <Col className="col-auto">
            <LessonPlaygroundStepTag active={isActive}>
              <Icon type="exercise" size="extra-small" />
            </LessonPlaygroundStepTag>
          </Col>
          <Col>
            <Text className="mb-0 mt-1" fontSize="extra-small" weight={500}>
              {title}
            </Text>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Text className="m-0" fontSize="extra-small" html={task.text} />
          </Col>
        </Row>
        {children}
        <Row className="mt-4">
          <Col>
            {onSubmit && (
              <Button
                size="extra-small"
                variant="tertiary"
                onClick={onSubmit}
                disabled={!onSubmit}
              >
                Submit
              </Button>
            )}
          </Col>
          <Col className="col-auto">
            <Button
              size="extra-small"
              variant="ghost"
              onClick={onReset}
              disabled={!onReset}
            >
              Reset
            </Button>
          </Col>
          <Col className="col-auto">
            <Button
              size="extra-small"
              variant="ghost"
              onClick={onHint || handleShowHint}
              disabled={!onHint && !hint}
            >
              Hint
            </Button>
          </Col>
        </Row>
      </LessonPlaygroundCard>
      {showHint && (
        <LessonPlaygroundCard>
          <Row>
            <Col className="col-auto">
              <LessonPlaygroundStepTag>
                <Icon type="lightbulb" size="extra-small" />
              </LessonPlaygroundStepTag>
            </Col>
            <Col>
              <Text className="mb-0 mt-1" fontSize="extra-small" weight={500}>
                Hint
              </Text>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Text className="m-0" fontSize="extra-small" html={hint?.text} />
            </Col>
          </Row>
        </LessonPlaygroundCard>
      )}
      {completed && hasExplanation(step) && (
        <LessonPlaygroundCard>
          <Row>
            <Col className="col-auto">
              <LessonPlaygroundStepTag>
                <Icon type="check" size="extra-small" />
              </LessonPlaygroundStepTag>
            </Col>
            <Col>
              <Text className="mb-0 mt-1" fontSize="extra-small" weight={500}>
                Explanation
              </Text>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Text
                className="m-0"
                fontSize="extra-small"
                html={explanation?.text}
              />
            </Col>
          </Row>
        </LessonPlaygroundCard>
      )}
    </>
  );
};

export default Playground;
