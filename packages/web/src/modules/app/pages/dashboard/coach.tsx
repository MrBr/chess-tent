import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Page, CoachTrainings, LessonBrowser } = components;
const { useMyLessons, useUserTrainings } = hooks;
const { Headline3 } = ui;

export default ({ user }: { user: User }) => {
  const { value: trainings } = useUserTrainings(user);
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const { value: lessons } = useMyLessons(
    `own-lessons-${user.id}`,
    lessonsFilter,
  );

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
      {trainings && (
        <>
          <Headline3>My trainings</Headline3>
          <CoachTrainings trainings={trainings} />
        </>
      )}
      <LessonBrowser
        lessons={lessons}
        onFiltersChange={handleFilterChange}
        editable
      />
    </Page>
  );
};
