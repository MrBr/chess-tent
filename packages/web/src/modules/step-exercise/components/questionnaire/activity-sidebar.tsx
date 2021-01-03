import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionnaireActivityState,
  ExerciseQuestionnaireState,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { Headline4, Button, Row, Col, Check, Container } = ui;
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
    selectedOptionIndex,
  } = stepActivityState as ExerciseQuestionnaireActivityState;
  const { question, explanation, options } = step.state
    .exerciseState as ExerciseQuestionnaireState;
  const completed = isStepCompleted(activity, step);
  const handleAnswerChange = useCallback(
    (optionIndex: number) => {
      setStepActivityState({
        selectedOptionIndex: optionIndex,
      });
    },
    [setStepActivityState],
  );
  const handleSubmit = useCallback(() => {
    completeStep(step);
  }, [completeStep, step]);

  return (
    <>
      <Headline4>Select the answer</Headline4>
      <LessonToolboxText defaultText={question} />
      <Container>
        {options?.map(({ text, correct }, index) => (
          <Row key={index} className="align-items-center">
            <Col className="col-auto pr-0">
              <Check
                isInvalid={!!(selectedOptionIndex && correct && completed)}
                onChange={() => handleAnswerChange(index)}
              />
            </Col>
            <Col className="pl-0">
              <LessonToolboxText defaultText={text} />
            </Col>
          </Row>
        ))}
      </Container>
      {completed && <LessonToolboxText defaultText={explanation} />}
      <Button onClick={handleSubmit} size="extra-small">
        Submit
      </Button>
    </>
  );
};

export default Playground;
