import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionState,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { Chessboard, LessonPlayground, LessonToolboxText } = components;
const { Headline3, Text, Button } = ui;

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
  const { answer } = stepActivityState as ExerciseQuestionActivityState;
  const { question, explanation } = step.state
    .exerciseState as ExerciseQuestionState;
  const completed = isStepCompleted(activity, step);
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
    <LessonPlayground
      board={
        <Chessboard fen={position} header={status} shapes={shapes} animation />
      }
      sidebar={
        <>
          <Headline3>Answer the question</Headline3>
          <Text>{question}</Text>
          <LessonToolboxText
            defaultText={answer}
            onChange={handleAnswerChange}
          />
          {completed && <Text>{explanation}</Text>}
          <Button onClick={handleSubmit}>Submit</Button>
        </>
      }
    />
  );
};

export default Playground;
