import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionStep,
} from '@types';
import { SegmentActivitySidebar } from '../segment';

const { LessonToolboxText } = components;
const { Row, Col } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivitySidebar']>
> = props => {
  const { stepActivityState, setStepActivityState, completeStep, step } = props;
  const { answer } = stepActivityState as ExerciseQuestionActivityState;
  const handleAnswerChange = useCallback(
    (text: string) => {
      setStepActivityState({
        answer: text,
      });
    },
    [setStepActivityState],
  );
  const handleSubmit = useCallback(() => {
    completeStep(step);
  }, [completeStep, step]);

  return (
    <SegmentActivitySidebar title="Question" {...props} onSubmit={handleSubmit}>
      <Row className="mt-2">
        <Col>
          <LessonToolboxText
            text={answer}
            placeholder="Type here..."
            onChange={handleAnswerChange}
          />
        </Col>
      </Row>
    </SegmentActivitySidebar>
  );
};

export default Playground;
