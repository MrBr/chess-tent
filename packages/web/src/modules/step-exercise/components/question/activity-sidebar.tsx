import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionStep,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';
import { SegmentActivitySidebar } from '../segment';

const { LessonToolboxText } = components;
const { Button, Headline5 } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivitySidebar']>
> = props => {
  const {
    stepActivityState,
    setStepActivityState,
    completeStep,
    step,
    activity,
  } = props;
  const { answer } = stepActivityState as ExerciseQuestionActivityState;
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
    <SegmentActivitySidebar title="Question" {...props}>
      <Headline5 className="mt-2 mb-1">Answer</Headline5>
      <LessonToolboxText
        defaultText={answer}
        placeholder="Type here..."
        onChange={handleAnswerChange}
      />
      {!completed && (
        <Button onClick={handleSubmit} size="extra-small" className="mt-2">
          Submit
        </Button>
      )}
    </SegmentActivitySidebar>
  );
};

export default Playground;
