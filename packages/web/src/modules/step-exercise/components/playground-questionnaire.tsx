import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionnaireActivityState,
  ExerciseQuestionnaireState,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { Chessboard, LessonPlayground } = components;
const { Headline3, Text, Button, Row, Col, Check } = ui;

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['Playground']
>> = ({
  step,
  status,
  stepActivityState,
  setStepActivityState,
  activity,
  completeStep,
}) => {
  const { position, shapes } = step.state;
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
    <LessonPlayground
      board={
        <Chessboard fen={position} header={status} shapes={shapes} animation />
      }
      sidebar={
        <>
          <Headline3>Select the answer</Headline3>
          <Text>{question}</Text>
          {options?.map(({ text, correct }, index) => (
            <Row key={index}>
              <Col xs={0}>
                <Check
                  isInvalid={!!(selectedOptionIndex && correct && completed)}
                  onChange={() => handleAnswerChange(index)}
                />
              </Col>
              <Col>
                <Text>{text}</Text>
              </Col>
            </Row>
          ))}
          {completed && <Text>{explanation}</Text>}
          <Button onClick={handleSubmit}>Submit</Button>
        </>
      }
    />
  );
};

export default Playground;
