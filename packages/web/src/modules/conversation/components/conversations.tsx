import React, { useEffect, useMemo } from 'react';
import { components, hooks, state, ui, utils, records } from '@application';
import { createConversation, User } from '@chess-tent/models';
import { sortBy, last } from 'lodash';
import Conversation from './conversation';
import { selectConversationByUsers } from '../state/selectors';

const { Container, Headline3, Text, Row, Col } = ui;
const { UserAvatar } = components;
const {
  actions: { updateEntities },
} = state;
const {
  useDispatchBatched,
  useSelector,
  useRecordInit,
  useActiveUserRecord,
} = hooks;
const { generateIndex } = utils;

export default () => {
  const dispatch = useDispatchBatched();
  const { value: activeUser } = useActiveUserRecord();
  const {
    value: participant,
    update: setParticipant,
    reset: clearParticipant,
  } = useRecordInit(records.conversationParticipant);
  const { value: conversations } = useRecordInit(
    records.activeUserConversations,
  );
  const conversation = useSelector(
    selectConversationByUsers(activeUser, participant),
  );

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
    <Container className="h-100 overflow-y-auto pl-5 pr-5">
      <Headline3 className="mb-5">Messages</Headline3>
      {participant && conversation && (
        <Conversation
          activeUser={activeUser}
          close={clearParticipant}
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
          <Row
            onClick={() => setParticipant(participant)}
            key={participant.id}
            className="mb-4"
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
                weight={
                  lastMessage?.read || lastMessage?.owner === activeUser.id
                    ? 400
                    : 700
                }
              >
                {lastMessage?.message}
              </Text>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};
