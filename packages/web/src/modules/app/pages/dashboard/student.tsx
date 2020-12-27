import React, { useCallback, useEffect, useState } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Layout, Coaches, LessonBrowser } = components;
const { useUserActivitiesRecord, useApi, useLessons } = hooks;
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

  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({
    owner: user.id,
  });
  const [lessons] = useLessons(`own-lessons-${user.id}`, lessonsFilter);

  const handleFilterChange = useCallback(
    (search, difficulty, tags) => {
      setLessonsFilter({
        owner: user.id,
        search,
        tagIds: tags.map((it: Tag) => it.id),
        difficulty,
        published: true,
      });
    },
    [setLessonsFilter, user.id],
  );

  return (
    <Layout>
      <Row noGutters>
        <Col>{activities && activities.length > 0 ? null : <Coaches />}</Col>
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
