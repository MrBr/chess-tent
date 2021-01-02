import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionState,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { LessonToolboxText } = components;
const { Headline4, Button } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule['ActivitySidebar']>
> = ({
  step,
  stepActivityState,
  setStepActivityState,
  activity,
  completeStep,
}) => {
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
    <>
      <Headline4>Answer the question</Headline4>
      <LessonToolboxText defaultText={question} />

      <LessonToolboxText defaultText={answer} onChange={handleAnswerChange} />
      {completed && <LessonToolboxText defaultText={explanation} />}
      <Button onClick={handleSubmit} size="extra-small">
        Submit
      </Button>
    </>
  );
};

export default Playground;
