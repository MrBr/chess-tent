import React, { FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import { isStepCompleted } from '@chess-tent/models';
import { SegmentActivityProps } from './types';

const { LessonToolboxText } = components;
const { Headline4, Button, Headline5 } = ui;

const Playground: FunctionComponent<
  SegmentActivityProps & { title: string }
> = ({
  step,
  activity,
  children,
  title,
  stepActivityState,
  setStepActivityState,
}) => {
  const { hint: showHint } = stepActivityState;
  const { task, explanation, hint } = step.state;
  const completed = isStepCompleted(activity, step);
  const handleShowHint = useCallback(() => {
    setStepActivityState({
      hint: true,
    });
  }, [setStepActivityState]);

  return (
    <>
      <Button onClick={handleShowHint} size="extra-small">
        Hint
      </Button>
      <Headline4 className="mt-2 mb-1">{title}</Headline4>
      <LessonToolboxText className="m-0" defaultText={task.text} />
      {completed && (
        <>
          <Headline5 className="mt-2 mb-1">Explanation</Headline5>
          <LessonToolboxText className="m-0" defaultText={explanation?.text} />
        </>
      )}
      {showHint && hint && (
        <>
          <Headline5 className="mt-2 mb-1">Hint</Headline5>
          <LessonToolboxText className="m-0" defaultText={hint?.text} />
        </>
      )}
      {children}
    </>
  );
};

export default Playground;
