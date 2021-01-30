import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionStep,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { LessonToolboxText } = components;
const { Headline4, Button } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivitySidebar']>
> = ({
  step,
  stepActivityState,
  setStepActivityState,
  activity,
  completeStep,
}) => {
  const { answer } = stepActivityState as ExerciseQuestionActivityState;
  const { task, explanation } = step.state;
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
      <LessonToolboxText defaultText={task.text} />
      <LessonToolboxText defaultText={answer} onChange={handleAnswerChange} />
      {completed && <LessonToolboxText defaultText={explanation?.text} />}
      <Button onClick={handleSubmit} size="extra-small">
        Submit
      </Button>
    </>
  );
};

export default Playground;
