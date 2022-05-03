import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';
import Welcome from './welcome';

const { Page, Coaches, LessonBrowser, Trainings } = components;
const { useLessons, useUserTrainings } = hooks;
const { Row, Col, Container } = ui;

const DashboardStudent = ({ user }: { user: User }) => {
  const { value: trainings } = useUserTrainings(user);

  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({
    owner: user.id,
  });
  const { value: lessons } = useLessons(`lessons`, lessonsFilter);

  const handleFilterChange = useCallback(
    (search, difficulty, tags) => {
      setLessonsFilter({
        owner: user.id,
        search,
        tagIds: tags.map((it: Tag) => it.id),
        difficulty,
        published: true,
      });
    },
    [setLessonsFilter, user.id],
  );

  return (
    <Page>
      <Container className="ps-5 pe-5">
        <Welcome name={user.name} />
        {!trainings || trainings.length === 0 ? (
          <Coaches />
        ) : (
          <Trainings trainings={trainings} />
        )}
        <Row className="g-0">
          <Col>
            <LessonBrowser
              lessons={lessons}
              onFiltersChange={handleFilterChange}
            />
          </Col>
        </Row>
      </Container>
    </Page>
  );
};

export default DashboardStudent;
