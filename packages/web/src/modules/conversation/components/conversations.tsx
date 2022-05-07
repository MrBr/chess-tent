import React, { useEffect, useMemo, useState } from 'react';
import { hooks, state, ui, utils, records } from '@application';
import { createConversation, User } from '@chess-tent/models';
import { sortBy, last } from 'lodash';

import Conversation from './conversation';
import { selectConversationByUsers } from '../state/selectors';
import ConversationRow from './conversation-row';

const { Offcanvas, Headline5 } = ui;
const {
  actions: { updateEntities },
} = state;
const { useDispatchBatched, useSelector, useRecordInit, useActiveUserRecord } =
  hooks;
const { generateIndex } = utils;

interface ConversationsProps {
  close: () => void;
  initialParticipant?: User;
}

const Conversations = ({ initialParticipant, close }: ConversationsProps) => {
  const dispatch = useDispatchBatched();
  const { value: activeUser } = useActiveUserRecord();
  const [participant, setParticipant] = useState(initialParticipant);
  const { value: conversations, load } = useRecordInit(
    records.activeUserConversations,
    'conversations',
  );
  const conversation = useSelector(
    selectConversationByUsers(activeUser, participant),
  );
  const haveSelectedConversation = participant && conversation;

  useEffect(() => {
    load(activeUser.id);
  }, [load, activeUser.id]);

  useEffect(() => {
    if (participant && !conversation) {
      const newConversation = createConversation(
        generateIndex(),
        [activeUser, participant],
        [],
      );
      dispatch(updateEntities(newConversation));
    }
  }, [participant, conversation, activeUser, dispatch]);

  const sortedConversations = useMemo(
    () =>
      sortBy(conversations, ({ messages }) => {
        const lastMessage = last(messages);
        if (messages.length === 0 || !lastMessage) {
          return 0;
        }
        return lastMessage.read || lastMessage.owner === activeUser.id ? 1 : 0;
      }),
    [activeUser.id, conversations],
  );

  return (
    <Offcanvas show onHide={close}>
      {haveSelectedConversation && (
        <Conversation
          activeUser={activeUser}
          close={() => setParticipant(undefined)}
          participant={participant}
          conversation={conversation}
        />
      )}
      {!haveSelectedConversation && (
        <>
          <Offcanvas.Header>
            <Headline5 className="m-0">Messages</Headline5>
          </Offcanvas.Header>
          <Offcanvas.Body className="h-100 overflow-y-auto px-3 py-4">
            {sortedConversations.map(conversation => {
              const participant =
                conversation.users.find(user => user.id !== activeUser.id) ||
                (conversation.users[0] as User); // User sends messages to himself
              const lastMessage = last(conversation.messages);
              return (
                <ConversationRow
                  participant={participant}
                  setParticipant={setParticipant}
                  read={
                    lastMessage?.read || lastMessage?.owner === activeUser.id
                  }
                  lastMessage={lastMessage?.message}
                />
              );
            })}
          </Offcanvas.Body>
        </>
      )}
    </Offcanvas>
  );
};

export default Conversations;
