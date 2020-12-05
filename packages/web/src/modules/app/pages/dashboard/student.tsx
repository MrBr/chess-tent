import React, { useCallback, useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Tag, User } from '@chess-tent/models';

const { Layout, Coaches, Activities, LessonBrowser } = components;
const { useUserActivitiesRecord, useApi, useUserLessonsRecord } = hooks;
const { Row, Col } = ui;

export default ({ user }: { user: User }) => {
  const [activities, saveActivities] = useUserActivitiesRecord(user);

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

  const { fetch: fetchLessons, response: lessonsResponse } = useApi(
    requests.lessons,
  );
  const [lessons, saveLessons] = useUserLessonsRecord(user);

  const handleFilterChange = useCallback(
    (search, difficulty, tags) => {
      fetchLessons({
        owner: user.id,
        search,
        tagIds: tags.map((it: Tag) => it.id),
        difficulty,
      });
    },
    [fetchLessons, user.id],
  );

  useEffect(() => {
    if (lessonsResponse) {
      saveLessons(lessonsResponse.data);
    }
  }, [saveLessons, lessonsResponse]);

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
          <LessonBrowser
            lessons={lessons}
            onFiltersChange={handleFilterChange}
          />
        </Col>
      </Row>
    </Layout>
  );
};
