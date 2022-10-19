import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionnaireActivityState,
  ExerciseQuestionnaireStep,
} from '@types';
import { SegmentActivitySidebar } from '../segment';

const { Headline5, Row, Col, Check, Container } = ui;
const { LessonToolboxText } = components;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionnaireStep>['ActivitySidebar']>
> = props => {
  const { step, stepActivityState, setStepActivityState, completeStep } = props;
  const { selectedOptions, completed } =
    stepActivityState as ExerciseQuestionnaireActivityState;
  const {
    task: { options },
  } = step.state;
  const handleAnswerChange = useCallback(
    (optionIndex: number) => {
      if (completed) {
        return;
      }
      setStepActivityState({
        selectedOptions: {
          ...selectedOptions,
          [optionIndex]: !selectedOptions?.[optionIndex],
        },
      });
    },
    [completed, selectedOptions, setStepActivityState],
  );
  const handleSubmit = useCallback(() => {
    completeStep(step);
  }, [completeStep, step]);
  const correctSubmission = options?.every(
    ({ correct }, index) => !!selectedOptions?.[index] === correct,
  );

  return (
    <SegmentActivitySidebar
      title="Select the correct options"
      onSubmit={handleSubmit}
      {...props}
    >
      <Headline5 className="mt-2 mb-2">
        {completed
          ? correctSubmission
            ? 'The options are correct'
            : 'The options are not correct'
          : ''}
      </Headline5>
      <Container className="mt-2">
        {options?.map(({ text, correct }, index) => (
          <Row key={index} className="align-items-center">
            <Col className="col-auto pr-0">
              <Check
                isInvalid={
                  !!(selectedOptions?.[index] && !correct && completed)
                }
                isValid={!!(correct && completed)}
                checked={!!selectedOptions?.[index]}
                onChange={() => handleAnswerChange(index)}
                label={<LessonToolboxText className="m-0" text={text} />}
              />
            </Col>
          </Row>
        ))}
      </Container>
    </SegmentActivitySidebar>
  );
};

export default Playground;
