import React, { useCallback, useState } from 'react';
import { components, hooks, rtc, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Page, Coaches, LessonBrowser, MyTrainings } = components;
const { useLessons, useUserTrainings } = hooks;
const { Row, Col } = ui;
const { Conferencing } = rtc;

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
      {!trainings || trainings.length === 0 ? (
        <Coaches />
      ) : (
        <MyTrainings trainings={trainings} user={user} />
      )}
      <Row noGutters>
        <Col>
          <LessonBrowser
            lessons={lessons}
            onFiltersChange={handleFilterChange}
            title="Public lessons"
          />
        </Col>
      </Row>
      <Row>
        <Conferencing activityId="6387149e-b0c9-4246-9a94-462a439b1af5" />
      </Row>
    </Page>
  );
};

export default DashboardStudent;
