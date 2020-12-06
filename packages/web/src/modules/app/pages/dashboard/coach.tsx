import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Layout, Coaches, Activities, Trainings, LessonBrowser } = components;
const { useUserActivitiesRecord, useLessons } = hooks;
const { Headline3 } = ui;

export default ({ user }: { user: User }) => {
  const [activities] = useUserActivitiesRecord(user);
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
      <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
      <Headline3>My trainings</Headline3>
      <Trainings user={user} />
    </Layout>
  );
};
