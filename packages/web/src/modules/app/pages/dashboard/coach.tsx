import React, { useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';
import { User } from '@chess-tent/models';

const { Layout, Coaches, Activities, Lessons } = components;
const { useUserLessonsRecord, useUserActivitiesRecord, useApi } = hooks;
const { Headline3 } = ui;

export default ({ user }: { user: User }) => {
  const [activities] = useUserActivitiesRecord(user);
  const [lessons, saveLessons] = useUserLessonsRecord(user);
  const { fetch: getLessons, response: lessonsResponse } = useApi(
    requests.lessons,
  );

  useEffect(() => {
    if (!lessons) {
      getLessons({ owner: user.id });
    }
  }, [getLessons, lessons, user.id]);

  useEffect(() => {
    if (lessonsResponse) {
      saveLessons(lessonsResponse.data);
    }
  }, [saveLessons, lessonsResponse]);

  return (
    <Layout>
      {activities && activities.length > 0 ? (
        <>
          <Headline3>My activities</Headline3>
          <Activities activities={activities} />
        </>
      ) : (
        <>
          <Headline3>Coaches</Headline3>
          <Coaches />
        </>
      )}
      <Headline3>My lessons</Headline3>
      <Lessons lessons={lessons} />
    </Layout>
  );
};
