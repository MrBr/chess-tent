import React, { useCallback, useState } from 'react';
import { components, hooks } from '@application';
import { Tag } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';
import LessonBrowser from '../components/lesson-browser';

const { Page } = components;
const { useLessons } = hooks;

const BrowseLessonsPage: React.FC = () => {
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const [lessons] = useLessons('all-lessons', lessonsFilter);

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
    </Page>
  );
};

export default BrowseLessonsPage;
