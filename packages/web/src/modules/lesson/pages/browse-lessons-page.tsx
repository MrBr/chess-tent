import React, { useCallback, useEffect } from 'react';
import { components, hooks, requests } from '@application';
import LessonBrowser from '../components/lesson-browser';
import { Tag, User } from '@chess-tent/models';

const { Layout } = components;
const { useActiveUserRecord, useUserLessonsRecord, useApi } = hooks;

const BrowseLessonsPage: React.FC = () => {
  const [activeUser] = useActiveUserRecord() as [User, never, never];

  const { fetch: fetchLessons, response } = useApi(requests.lessons);
  const [lessons, saveLessons] = useUserLessonsRecord(activeUser);

  const handleFilterChange = useCallback(
    (search, difficulty, tags) => {
      fetchLessons({
        owner: activeUser.id,
        search,
        tagIds: tags.map((it: Tag) => it.id),
        difficulty,
      });
    },
    [fetchLessons, activeUser.id],
  );

  useEffect(() => {
    if (response) {
      saveLessons(response.data);
    }
  }, [saveLessons, response]);

  return (
    <Layout>
      <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
    </Layout>
  );
};

export default BrowseLessonsPage;
