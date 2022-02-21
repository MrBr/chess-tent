import React, {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { components, ui } from '@application';
import {
  ExerciseModule,
  ExerciseQuestionActivityState,
  ExerciseQuestionStep,
} from '@types';
import { isLessonActivityStepCompleted } from '@chess-tent/models';
import { SegmentActivitySidebar } from '../segment';

const { LessonToolboxText } = components;
const { Button, Headline5, Text } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivitySidebar']>
> = props => {
  const {
    stepActivityState,
    setStepActivityState,
    completeStep,
    step,
    activity,
    activeBoard,
  } = props;
  const { answer } = stepActivityState as ExerciseQuestionActivityState;
  const completed = isLessonActivityStepCompleted(activity, activeBoard, step);
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

  const InitialHtmlText = ({ initialHtml }: { initialHtml?: string }) =>
    useMemo(() => <Text className="m-0" initialHtml={initialHtml} />, [
      initialHtml,
    ]);

  return (
    <SegmentActivitySidebar title="Question" {...props}>
      <Headline5 className="mt-2 mb-1">Answer</Headline5>
      {!completed && (
        <LessonToolboxText
          defaultText={answer}
          placeholder="Type here..."
          onChange={handleAnswerChange}
        />
      )}
      {completed && <InitialHtmlText initialHtml={answer} />}
      {!completed && (
        <Button onClick={handleSubmit} size="extra-small" className="mt-2">
          Submit
        </Button>
      )}
    </SegmentActivitySidebar>
  );
};

export default Playground;
