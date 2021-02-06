import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionStep,
} from '@types';
import { SegmentActivitySidebar } from '../segment';

const { LessonToolboxText } = components;
const { Button } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivitySidebar']>
> = props => {
  const { stepActivityState, setStepActivityState, completeStep, step } = props;
  const { answer } = stepActivityState as ExerciseQuestionActivityState;
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
    <SegmentActivitySidebar title="Answer the question" {...props}>
      <LessonToolboxText defaultText={answer} onChange={handleAnswerChange} />
      <Button onClick={handleSubmit} size="extra-small">
        Submit
      </Button>
    </SegmentActivitySidebar>
  );
};

export default Playground;
