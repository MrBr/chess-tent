import React from 'react';
import { components, hooks } from '@application';

const { Page, LessonTemplates } = components;
const { useMyLessons } = hooks;

const BrowseLessonsPage: React.FC = () => {
  const lessons = useMyLessons();

  return (
    <Page>{lessons.value && <LessonTemplates lessons={lessons.value} />}</Page>
  );
};

export default BrowseLessonsPage;
