import React, { useCallback, useState } from 'react';
import { components, hooks, rtc } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Page, LessonBrowser, MyTrainings } = components;
const { useMyLessons, useUserTrainings, useActivity } = hooks;
const { Conferencing } = rtc;

const DashboardCoach = ({ user }: { user: User }) => {
  const { value: trainings } = useUserTrainings(user);
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  // NOTE: for RTC development purposes
  useActivity('6387149e-b0c9-4246-9a94-462a439b1af5');

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
      <Conferencing activityId="6387149e-b0c9-4246-9a94-462a439b1af5" />
    </Page>
  );
};

export default DashboardCoach;
