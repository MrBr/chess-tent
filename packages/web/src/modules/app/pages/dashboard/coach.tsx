import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Page, CoachTrainings, LessonBrowser } = components;
const { useLessons } = hooks;
const { Headline3 } = ui;

export default ({ user }: { user: User }) => {
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const [lessons] = useLessons(`own-lessons-${user.id}`, lessonsFilter, {
    my: true,
  });

  const handleFilterChange = useCallback(
    (search, difficulty, tags) => {
      setLessonsFilter({
        search,
        tagIds: tags.map((it: Tag) => it.id),
        difficulty,
      });
    },
    [setLessonsFilter],
  );

  return (
    <Page>
      <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
      <Headline3>My trainings</Headline3>
      <CoachTrainings user={user} />
    </Page>
  );
};
