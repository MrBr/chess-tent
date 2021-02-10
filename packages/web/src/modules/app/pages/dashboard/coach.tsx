import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';

const { Page, CoachTrainings, LessonBrowser } = components;
const { useLessons, useUserTrainings } = hooks;
const { Headline3, Button, Modal } = ui;

export default ({ user }: { user: User }) => {
  const [trainings] = useUserTrainings(user);
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const [lessons] = useLessons(`own-lessons-${user.id}`, lessonsFilter, {
    my: true,
  });
  const [isModalVisible, setModalVisibility] = useState(false);

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
      <Button onClick={() => setModalVisibility(true)}>Invite student</Button>
      {/* this will be invitationModal */}
      <Modal close={() => setModalVisibility(false)} show={isModalVisible}>
        <Modal.Header>Invite student</Modal.Header>
        <Modal.Body>body</Modal.Body>
      </Modal>
      {trainings && (
        <>
          <Headline3>My trainings</Headline3>
          <CoachTrainings trainings={trainings} />
        </>
      )}
      <LessonBrowser lessons={lessons} onFiltersChange={handleFilterChange} />
    </Page>
  );
};
