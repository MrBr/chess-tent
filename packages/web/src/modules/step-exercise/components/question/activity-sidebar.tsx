import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  ChangeEvent,
} from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionStep,
} from '@types';
import { SegmentActivitySidebar } from '../segment';

const { Input } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivitySidebar']>
> = props => {
  const { stepActivityState, setStepActivityState, completeStep, step } = props;
  const { answer } = stepActivityState as ExerciseQuestionActivityState;
  const handleAnswerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setStepActivityState({
        answer: e.target?.value,
      });
    },
    [setStepActivityState],
  );
  const handleSubmit = useCallback(() => {
    completeStep(step);
  }, [completeStep, step]);

  return (
    <SegmentActivitySidebar title="Question" {...props} onSubmit={handleSubmit}>
      <Input
        size="extra-small"
        value={answer}
        placeholder="Type here..."
        onChange={handleAnswerChange}
      />
    </SegmentActivitySidebar>
  );
};

export default Playground;
