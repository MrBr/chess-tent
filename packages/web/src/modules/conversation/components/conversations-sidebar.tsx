import React, { useEffect } from 'react';
import { components, hooks, requests, state, ui, utils } from '@application';
import { createConversation, User } from '@chess-tent/models';
import Conversation from './conversation';
import { selectConversationByUsers } from '../state/selectors';

const { Container, Headline3, Text, Row, Col } = ui;
const { UserAvatar } = components;
const {
  actions: { updateEntities },
} = state;
const {
  useApi,
  useComponentStateSilent,
  useActiveUserRecord,
  useConversationParticipant,
  useDispatchBatched,
  useSelector,
} = hooks;
const { generateIndex } = utils;

export default () => {
  const dispatch = useDispatchBatched();
  const { mounted } = useComponentStateSilent();
  const { fetch: findConversations, response } = useApi(requests.conversations);
  const [activeUser] = useActiveUserRecord() as [User, never, never];
  const [
    participant,
    setParticipant,
    clearParticipant,
  ] = useConversationParticipant();
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

  useEffect(() => {
    !mounted && findConversations(activeUser.id);
  }, [mounted, findConversations, activeUser.id]);

  useEffect(() => {
    response && dispatch(updateEntities(response.data));
  }, [dispatch, response]);

  return (
    <Container className="h-100 overflow-y-auto pl-5 pr-5">
      <Headline3 className="mb-5">Messages</Headline3>
      {participant && conversation && (
        <Conversation
          owner={activeUser}
          close={clearParticipant}
          participant={participant}
          conversation={conversation}
        />
      )}
      {response?.data.map(conversation => {
        const participant = conversation.users.find(
          user => user.id !== activeUser.id,
        ) as User;
        return (
          <Row onClick={() => setParticipant(participant)} key={participant.id}>
            <Col className="col-auto d-flex align-items-center">
              <UserAvatar user={participant} />
            </Col>
            <Col>
              <Text weight={700} className="m-0" fontSize="small">
                {participant.name}
              </Text>
              <Text className="m-0 text-truncate" fontSize="small">
                {conversation.messages[0]?.message}
              </Text>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};
