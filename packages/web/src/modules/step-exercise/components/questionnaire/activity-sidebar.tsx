import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionnaireActivityState,
  ExerciseQuestionnaireState,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { Headline4, Button, Row, Col, Check, Container, Text } = ui;
const { LessonToolboxText } = components;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule['ActivitySidebar']>
> = ({
  step,
  stepActivityState,
  setStepActivityState,
  activity,
  completeStep,
}) => {
  const {
    selectedOptions,
  } = stepActivityState as ExerciseQuestionnaireActivityState;
  const { question, explanation, options } = step.state
    .exerciseState as ExerciseQuestionnaireState;
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
    <>
      <Headline4>
        {completed
          ? correctSubmission
            ? 'Correct'
            : 'Incorrect'
          : 'Select the answer'}
      </Headline4>
      <LessonToolboxText defaultText={question} />
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
      {completed && (
        <>
          <Text className="mt-2 mb-0">Explanation:</Text>
          <LessonToolboxText defaultText={explanation} />
        </>
      )}
      <Button onClick={handleSubmit} size="extra-small" className="mt-2">
        Submit
      </Button>
    </>
  );
};

export default Playground;
