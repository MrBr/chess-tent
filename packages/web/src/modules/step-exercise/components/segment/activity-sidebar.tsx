import React, { FunctionComponent, useCallback } from 'react';
import { ui } from '@application';
import { isStepCompleted } from '@chess-tent/models';
import { SegmentActivityProps } from '../../types';

const { Headline4, Button, Headline5, Text } = ui;

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
      <Button
        onClick={handleShowHint}
        size="extra-small"
        variant={showHint ? 'regular' : 'primary'}
        disabled={showHint}
      >
        Show Hint
      </Button>
      <Headline4 className="mt-2 mb-1">{title}</Headline4>
      <Text
        className="m-0"
        fontSize="small"
        color="subtitle"
        initialHtml={task.text}
      />
      {completed && (
        <>
          <Headline5 className="mt-2 mb-1">Explanation</Headline5>
          <Text
            className="m-0"
            fontSize="small"
            color="subtitle"
            initialHtml={explanation?.text}
          />
        </>
      )}
      {showHint && hint && (
        <>
          <Headline5 className="mt-2 mb-1">Hint</Headline5>
          <Text
            className="m-0"
            fontSize="small"
            color="subtitle"
            initialHtml={hint?.text}
          />
        </>
      )}
      {children}
    </>
  );
};

export default Playground;
