import React, { PropsWithChildren, ReactElement } from 'react';
import { ActivityRendererModuleProps, Steps } from '@types';
import { components, hooks, ui } from '@application';
import { Chapter } from '@chess-tent/models';

import { isCoach, isOwner } from '../service';

const { Evaluation, LessonPlaygroundCard } = components;
const { Text, Row, Col } = ui;
const { useActiveUserRecord } = hooks;

export const ActivityRendererAnalysisEngineCard = <
  T extends Steps | undefined,
  K extends Chapter | undefined = Chapter | undefined,
>(
  props: PropsWithChildren<ActivityRendererModuleProps<T, K>>,
): ReactElement<any, any> | null => {
  const { activity } = props;
  const { value: user } = useActiveUserRecord();

  if (
    activity.state.disableEngine &&
    !isCoach(activity, user) &&
    !isOwner(activity, user)
  ) {
    return null;
  }

  return (
    <LessonPlaygroundCard stretch>
      <Evaluation />
      {activity.state.disableEngine && (
        <Row>
          <Col>
            <Text fontSize="smallest" className="mb-0">
              Only coach can see engine
            </Text>
          </Col>
        </Row>
      )}
    </LessonPlaygroundCard>
  );
};
