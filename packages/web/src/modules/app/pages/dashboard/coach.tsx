import React, { useCallback, useState } from 'react';
import { components, hooks } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Page, LessonBrowser, MyTrainings } = components;
const { useMyLessons, useUserTrainings } = hooks;

const DashboardCoach = ({ user }: { user: User }) => {
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
      {trainings && <MyTrainings trainings={trainings} user={user} />}
      <LessonBrowser
        lessons={lessons}
        onFiltersChange={handleFilterChange}
        title="My lessons"
        editable
      />
    </Page>
  );
};

export default DashboardCoach;
