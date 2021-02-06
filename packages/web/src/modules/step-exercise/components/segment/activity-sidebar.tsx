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
  const { hint } = stepActivityState;
  const { task, explanation } = step.state;
  const completed = isStepCompleted(activity, step);
  const showHint = useCallback(() => {
    setStepActivityState({
      hint: true,
    });
  }, [setStepActivityState]);

  return (
    <>
      <Button onClick={showHint} size="extra-small">
        Hint
      </Button>
      <Headline4 className="m-0">{title}</Headline4>
      <LessonToolboxText defaultText={task.text} />
      {children}
      {completed && (
        <>
          <Headline5 className="m-0">Explanation</Headline5>
          <LessonToolboxText defaultText={explanation?.text} />
        </>
      )}
      {!completed && hint && (
        <>
          <Headline5 className="m-0">Hint</Headline5>
          <LessonToolboxText defaultText={explanation?.text} />
        </>
      )}
    </>
  );
};

export default Playground;
