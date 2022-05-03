import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';
import LessonBrowser from '../components/lesson-browser';

const { Page } = components;
const { useLessons } = hooks;
const { Headline4, Text, Container } = ui;

const BrowseLessonsPage: React.FC = () => {
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const { value: lessons } = useLessons('all-lessons', lessonsFilter);

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
      <Container className="ps-5 pe-5">
        <Headline4 className="m-0 mt-4">Lessons 📚</Headline4>
        <Text className="mb-5">
          Browse the interactive lessons and study on your own.
        </Text>
        <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
      </Container>
    </Page>
  );
};

export default BrowseLessonsPage;
