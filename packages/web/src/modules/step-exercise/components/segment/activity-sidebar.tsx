import React, { FunctionComponent, useCallback } from 'react';
import { ui, hooks, components } from '@application';
import { isStepCompleted } from '@chess-tent/models';

import { SegmentActivityProps } from '../../types';
import { hasExplanation, hasHint } from '../../service';

const { Headline4, Button, Headline5, Text, Row, Col } = ui;
const { useActivityMeta } = hooks;
const { LessonPlaygroundCard } = components;

const Playground: FunctionComponent<
  SegmentActivityProps & { title: string; onReset?: () => void }
> = ({ step, activity, children, title, onReset, setStepActivityState }) => {
  const [{ showHint }, updateActivityMeta] = useActivityMeta(activity);
  const { task, explanation, hint } = step.state;
  const completed = isStepCompleted(activity, step);
  const handleShowHint = useCallback(() => {
    updateActivityMeta({ showHint: true });
  }, [updateActivityMeta]);

  const reset = useCallback(() => {
    setStepActivityState({});
  }, [updateActivityMeta]);

  const resetHandle = onReset;

  return (
    <>
      <LessonPlaygroundCard>
        <Headline4 className="mt-2 mb-1">{title}</Headline4>
        <Text
          className="m-0"
          fontSize="small"
          color="subtitle"
          initialHtml={task.text}
        />
        {children}
        {resetHandle && (
          <Row>
            <Col>
              <Button
                size="extra-small"
                variant="regular"
                onClick={resetHandle}
              >
                Reset
              </Button>
            </Col>
          </Row>
        )}
      </LessonPlaygroundCard>
      {completed && hasExplanation(step) && (
        <LessonPlaygroundCard>
          <Headline5 className="mt-2 mb-1">Explanation</Headline5>
          <Text
            className="m-0"
            fontSize="small"
            color="subtitle"
            initialHtml={explanation?.text}
          />
        </LessonPlaygroundCard>
      )}
      {!completed && hasHint(step) && (
        <LessonPlaygroundCard>
          <Headline5 className="mt-2 ">Hint</Headline5>
          {showHint ? (
            <>
              <Text
                className="m-0"
                fontSize="small"
                color="subtitle"
                initialHtml={hint?.text}
              />
            </>
          ) : (
            <Button
              onClick={handleShowHint}
              size="extra-small"
              variant="regular"
            >
              Show Hint
            </Button>
          )}
        </LessonPlaygroundCard>
      )}
    </>
  );
};

export default Playground;
