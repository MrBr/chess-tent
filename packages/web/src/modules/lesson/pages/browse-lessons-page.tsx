import React, { useCallback, useEffect, useState } from 'react';
import { components, hooks, requests } from '@application';
import LessonBrowser from '../components/lesson-browser';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Layout } = components;
const { useActiveUserRecord, useUserLessonsRecord, useApi, useLessons } = hooks;

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
    <Layout>
      <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
    </Layout>
  );
};

export default BrowseLessonsPage;
