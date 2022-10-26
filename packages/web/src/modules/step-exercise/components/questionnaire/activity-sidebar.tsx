import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionnaireActivityState,
  ExerciseQuestionnaireStep,
} from '@types';
import { SegmentActivitySidebar } from '../segment';

const { Text, Row, Col, Check, Container } = ui;

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

  return (
    <SegmentActivitySidebar
      title="Select options"
      onSubmit={handleSubmit}
      {...props}
    >
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
                label={
                  <Text className="m-0" fontSize="smallest">
                    {text}
                  </Text>
                }
              />
            </Col>
          </Row>
        ))}
      </Container>
    </SegmentActivitySidebar>
  );
};

export default Playground;
