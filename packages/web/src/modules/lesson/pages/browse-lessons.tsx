import React, { useCallback, useState } from 'react';
import { components, hooks } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';
import LessonBrowser from '../components/lesson-browser';

const { Page } = components;
const { useActiveUserRecord, useLessons } = hooks;

const BrowseLessonsPage: React.FC = () => {
  const [activeUser] = useActiveUserRecord() as [User, never, never];
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const [lessons] = useLessons('all-lessons', lessonsFilter);

  const handleFilterChange = useCallback(
    (search, difficulty, tags) => {
      setLessonsFilter({
        owner: activeUser.id,
        search,
        tagIds: tags.map((it: Tag) => it.id),
        difficulty,
        published: true,
      });
    },
    [setLessonsFilter, activeUser.id],
  );

  return (
    <Page>
      <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
    </Page>
  );
};

export default BrowseLessonsPage;
