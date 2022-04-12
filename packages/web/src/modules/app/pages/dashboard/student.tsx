import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag, TYPE_ACTIVITY, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const {
  Page,
  Coaches,
  ConferencingPeer,
  ConferencingProvider,
  LessonBrowser,
  MyTrainings,
} = components;
const { useLessons, useUserTrainings, useActivity, useSocketRoomUsers } = hooks;
const { Row, Col } = ui;

const DashboardStudent = ({ user }: { user: User }) => {
  const { value: trainings } = useUserTrainings(user);
  // NOTE: for RTC development purposes
  useActivity('6387149e-b0c9-4246-9a94-462a439b1af5');

  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({
    owner: user.id,
  });
  const liveUsers = useSocketRoomUsers(
    `${TYPE_ACTIVITY}-6387149e-b0c9-4246-9a94-462a439b1af5`,
  );
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

  console.log(liveUsers);

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
        <ConferencingProvider>
          <>
            {liveUsers
              .filter(Boolean)
              .filter(({ id }) => id !== user.id)
              .map(({ id }) => (
                <ConferencingPeer
                  key={id}
                  activityId="6387149e-b0c9-4246-9a94-462a439b1af5"
                  fromUserId={id}
                  toUserId={user.id}
                />
              ))}
          </>
        </ConferencingProvider>
      </Row>
    </Page>
  );
};

export default DashboardStudent;
