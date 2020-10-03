import React, { useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';
import { User } from '@chess-tent/models';

const { Layout, Coaches, Activities, Lessons } = components;
const { useUserLessonsRecord, useUserActivitiesRecord, useApi } = hooks;
const { Row, Col } = ui;

export default ({ user }: { user: User }) => {
  const [activities, saveActivities] = useUserActivitiesRecord(user);
  const [lessons] = useUserLessonsRecord(user);

  const { fetch: getActivities, response: activitiesResponse } = useApi(
    requests.activities,
  );

  useEffect(() => {
    if (!activities) {
      getActivities({ owner: user.id, users: user.id });
    }
  }, [getActivities, activities, user.id]);

  useEffect(() => {
    if (activitiesResponse) {
      saveActivities(activitiesResponse.data);
    }
  }, [saveActivities, activitiesResponse]);

  return (
    <Layout>
      <Row noGutters>
        <Col>
          {activities && activities.length > 0 ? (
            <Activities activities={activities} />
          ) : (
            <Coaches />
          )}
        </Col>
      </Row>
      <Row noGutters>
        <Col>
          <Lessons lessons={lessons} />
        </Col>
      </Row>
    </Layout>
  );
};
