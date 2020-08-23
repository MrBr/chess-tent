import React, { useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Lesson } from '@chess-tent/models';
import { Components } from '@types';

const { useRecord, useApi } = hooks;
const { Link } = components;
const { Container } = ui;

const Lessons: Components['Lessons'] = ({ owner }) => {
  const { fetch, response } = useApi(requests.lessons);
  const [lessons, saveLessons] = useRecord<Lesson[]>(`${owner.id}-lessons`);

  useEffect(() => {
    if (!lessons) {
      fetch({ owner: owner.id });
    }
  }, [fetch, lessons]);

  useEffect(() => {
    if (response) {
      saveLessons(response.data);
    }
  }, [saveLessons, response]);

  return (
    <>
      {lessons?.map(lesson => (
        <Container key={lesson.id}>
          <Link to={`/lesson/${lesson.id}`}>{lesson.id}</Link>
        </Container>
      ))}
    </>
  );
};

export default Lessons;
