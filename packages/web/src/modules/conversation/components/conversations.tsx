import React, { useEffect, useMemo, FunctionComponent, useState } from 'react';
import { components, hooks, state, ui, utils, records } from '@application';
import { createConversation, User } from '@chess-tent/models';
import styled from '@emotion/styled';
import { sortBy, last } from 'lodash';
import Conversation from './conversation';
import { selectConversationByUsers } from '../state/selectors';

const { Container, Text, Row, Col } = ui;
const { UserAvatar } = components;
const {
  actions: { updateEntities },
} = state;
const { useDispatchBatched, useSelector, useRecordInit, useActiveUserRecord } =
  hooks;
const { generateIndex } = utils;

const ConversationRow = styled<
  FunctionComponent<{
    participant: User;
    setParticipant: (user: User) => void;
    read: boolean;
    lastMessage?: string;
    className?: string;
  }>
>(({ participant, setParticipant, read, lastMessage, className }) => (
  <Row
    onClick={() => setParticipant(participant)}
    key={participant.id}
    className={`g-0 ${className}`}
  >
    <Col className="col-auto d-flex align-items-center pr-0">
      <UserAvatar user={participant} />
    </Col>
    <Col className="text-truncate">
      <Text
        weight={700}
        className="m-0 text-truncate"
        fontSize="small"
        color="title"
      >
        {participant.name}
      </Text>
      <Text
        className="m-0 text-truncate"
        fontSize="small"
        color="title"
        weight={read ? 400 : 700}
      >
        {lastMessage}
      </Text>
    </Col>
  </Row>
))({
  ':hover': {
    background: '#e7e7e7',
  },
  cursor: 'pointer',
  padding: '0.75em 1.5em',
});

const Conversations = ({
  initialParticipant,
}: {
  initialParticipant?: User;
}) => {
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
    <Container className="h-100 overflow-y-auto p-0">
      {participant && conversation && (
        <Conversation
          activeUser={activeUser}
          close={() => setParticipant(undefined)}
          participant={participant}
          conversation={conversation}
        />
      )}
      {sortedConversations.map(conversation => {
        const participant =
          conversation.users.find(user => user.id !== activeUser.id) ||
          (conversation.users[0] as User); // User sends messages to himself
        const lastMessage = last(conversation.messages);
        return (
          <ConversationRow
            participant={participant}
            setParticipant={setParticipant}
            read={lastMessage?.read || lastMessage?.owner === activeUser.id}
            lastMessage={lastMessage?.message}
          />
        );
      })}
    </Container>
  );
};

export default Conversations;
