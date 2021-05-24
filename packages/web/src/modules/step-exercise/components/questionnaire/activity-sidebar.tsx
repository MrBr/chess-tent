import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionnaireActivityState,
  ExerciseQuestionnaireStep,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';
import { SegmentActivitySidebar } from '../segment';

const { Headline5, Button, Row, Col, Check, Container } = ui;

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
    <SegmentActivitySidebar title="Select the correct answers" {...props}>
      <Headline5 className="mt-2 mb-2">
        {completed
          ? correctSubmission
            ? 'The answers are correct'
            : 'The answers are not correct'
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
                label={text}
              />
            </Col>
          </Row>
        ))}
      </Container>
      {!completed && (
        <Button onClick={handleSubmit} size="extra-small" className="mt-2">
          Submit
        </Button>
      )}
    </SegmentActivitySidebar>
  );
};

export default Playground;
