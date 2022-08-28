import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag } from '@chess-tent/models';
import { LessonsFilters } from '@chess-tent/types';
import LessonBrowser from '../components/lesson-browser';

const { Page } = components;
const { useLessons, useOpenLesson } = hooks;
const { Headline4, Text } = ui;

const BrowseLessonsPage: React.FC = () => {
  const [lessonsFilter, setLessonsFilter] = useState<LessonsFilters>({});
  const { value: lessons } = useLessons('all-lessons', lessonsFilter);
  const handleLessonClick = useOpenLesson();

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
      <Page.Body>
        <Headline4 className="m-0 mt-4">Lessons 📚</Headline4>
        <Text className="mb-5">
          Browse the interactive lessons and study on your own.
        </Text>
        <LessonBrowser
          lessons={lessons}
          onFiltersChange={handleFilterChange}
          onLessonClick={handleLessonClick}
        />
      </Page.Body>
    </Page>
  );
};

export default BrowseLessonsPage;
