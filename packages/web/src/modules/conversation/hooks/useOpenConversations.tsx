import React, { useCallback } from 'react';
import { hooks, ui } from '@application';
import { User } from '@chess-tent/models';

import Conversations from '../components/conversations';

const { usePromptOffcanvas } = hooks;
const { Offcanvas } = ui;

const useOpenConversations = () => {
  const promptOffcanvas = usePromptOffcanvas();
  return useCallback(
    (initialParticipant?: User) =>
      promptOffcanvas(close => (
        <Offcanvas show onHide={close}>
          <Offcanvas.Header closeButton>Messages</Offcanvas.Header>
          <Conversations initialParticipant={initialParticipant} />
        </Offcanvas>
      )),
    [promptOffcanvas],
  );
};

export default useOpenConversations;
