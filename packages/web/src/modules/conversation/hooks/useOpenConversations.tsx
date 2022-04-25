import React, { useCallback, useState, useEffect, ReactElement } from 'react';
import { hooks, ui } from '@application';
import { User } from '@chess-tent/models';

import Conversations from '../components/conversations';

const { usePrompt } = hooks;
const { Offcanvas } = ui;

const useOpenConversations = (): [
  ReactElement | undefined,
  (user?: User) => void,
] => {
  const [initialParticipant, setInitialParticipant] = useState<User>();

  const [conversationOffcanvas, promptOffcanvas] = usePrompt(close => (
    <Offcanvas show onHide={close}>
      <Offcanvas.Header closeButton>Messages</Offcanvas.Header>
      <Conversations initialParticipant={initialParticipant} />
    </Offcanvas>
  ));

  useEffect(() => {
    if (initialParticipant) {
      promptOffcanvas();
    }
  }, [promptOffcanvas, initialParticipant]);

  const promptConversation = useCallback(
    (initialParticipant?: User) =>
      initialParticipant
        ? setInitialParticipant(initialParticipant)
        : promptOffcanvas(),
    [promptOffcanvas],
  );

  return [conversationOffcanvas, promptConversation];
};

export default useOpenConversations;
