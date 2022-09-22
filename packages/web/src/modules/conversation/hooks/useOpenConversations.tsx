import React, { useCallback, useState, useEffect, ReactElement } from 'react';
import { hooks } from '@application';
import { User } from '@chess-tent/models';

import Conversations from '../components/conversations';

const { usePrompt } = hooks;

const useOpenConversations = (): [
  ReactElement | undefined,
  (user?: User) => void,
] => {
  const [initialParticipant, setInitialParticipant] = useState<User>();

  const [conversationOffcanvas, promptOffcanvas] = usePrompt(close => (
    <Conversations close={close} initialParticipant={initialParticipant} />
  ));

  const promptConversation = useCallback(
    (initialParticipant?: User) => {
      initialParticipant && setInitialParticipant(initialParticipant);
      promptOffcanvas();
    },
    [promptOffcanvas],
  );

  return [conversationOffcanvas, promptConversation];
};

export default useOpenConversations;
