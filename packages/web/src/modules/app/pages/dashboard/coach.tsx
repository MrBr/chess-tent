import React, { useCallback, useState, useRef } from 'react';
import { components, hooks, ui } from '@application';
import { Tag, User } from '@chess-tent/models';
import { LessonsRequest } from '@chess-tent/types';
import { API_PATH } from '../../../api';

const { Page, CoachTrainings, LessonBrowser } = components;
const { useLessons, useUserTrainings } = hooks;
const { Headline3, Button, Modal, Input, Tooltip, Overlay } = ui;

export default ({ user }: { user: User }) => {
  const [trainings] = useUserTrainings(user);
  const [lessonsFilter, setLessonsFilter] = useState<LessonsRequest>({});
  const [lessons] = useLessons(`own-lessons-${user.id}`, lessonsFilter, {
    my: true,
  });
  const target = useRef();
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isLinkCopied, setLink] = useState(false);

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
        <Modal.Body>
          <Input value={`${API_PATH}/register?invitation=${user.id}`} />
          <Button ref={target} onClick={() => setLink(true)} size="extra-small">
            Copy link
          </Button>
          <Overlay
            //@ts-ignore
            target={target.current}
            show={isLinkCopied}
            placement="right"
          >
            {props => (
              <Tooltip {...props} show={isLinkCopied} id="copy-link">
                Link copied
              </Tooltip>
            )}
          </Overlay>
        </Modal.Body>
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
