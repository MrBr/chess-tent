import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionnaireActivityState,
  ExerciseQuestionnaireStep,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';
import { SegmentActivitySidebar } from '../segment';

const { Headline4, Button, Row, Col, Check, Container } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionnaireStep>['ActivitySidebar']>
> = props => {
  const {
    step,
    stepActivityState,
    setStepActivityState,
    activity,
    completeStep,
  } = props;
  const {
    selectedOptions,
  } = stepActivityState as ExerciseQuestionnaireActivityState;
  const {
    task: { options },
  } = step.state;
  const completed = isStepCompleted(activity, step);
  const handleAnswerChange = useCallback(
    (optionIndex: number) => {
      setStepActivityState({
        selectedOptions: {
          ...selectedOptions,
          [optionIndex]: !selectedOptions?.[optionIndex],
        },
      });
    },
    [selectedOptions, setStepActivityState],
  );
  const handleSubmit = useCallback(() => {
    completeStep(step);
  }, [completeStep, step]);
  const correctSubmission = options?.every(
    ({ correct }, index) => !!selectedOptions?.[index] === correct,
  );

  return (
    <SegmentActivitySidebar title="Select the answer" {...props}>
      <Headline4>
        {completed ? (correctSubmission ? 'Correct' : 'Incorrect') : ''}
      </Headline4>
      <Container className="mt-2">
        {options?.map(({ text, correct }, index) => (
          <Row key={index} className="align-items-center">
            <Col className="col-auto pr-0">
              <Check
                isInvalid={
                  !!(selectedOptions?.[index] && !correct && completed)
                }
                isValid={!!(correct && completed)}
                onChange={() => handleAnswerChange(index)}
                label={text}
              />
            </Col>
          </Row>
        ))}
      </Container>
      <Button onClick={handleSubmit} size="extra-small" className="mt-2">
        Submit
      </Button>
    </SegmentActivitySidebar>
  );
};

export default Playground;
