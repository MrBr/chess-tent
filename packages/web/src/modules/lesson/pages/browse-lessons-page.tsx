import React from 'react';
import { components, hooks } from '@application';
import LessonBrowser from '../components/lesson-browser';
import { User } from '@chess-tent/models';

const { Layout } = components;
const { useActiveUserRecord } = hooks;

const BrowseLessonsPage: React.FC = () => {
  const [activeUser] = useActiveUserRecord() as [User, never, never];

  return (
    <Layout>
      <LessonBrowser user={activeUser} />
    </Layout>
  );
};

export default BrowseLessonsPage;
