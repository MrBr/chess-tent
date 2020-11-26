import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';

const { Layout, Coaches, Activities, Trainings, LessonBrowser } = components;
const { useUserActivitiesRecord } = hooks;
const { Headline3 } = ui;

export default ({ user }: { user: User }) => {
  const [activities] = useUserActivitiesRecord(user);

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
      <LessonBrowser user={user} />
      <Headline3>My trainings</Headline3>
      <Trainings user={user} />
    </Layout>
  );
};
