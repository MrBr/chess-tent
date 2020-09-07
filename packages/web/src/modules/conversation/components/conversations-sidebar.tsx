import React, { ReactElement, useCallback, useEffect } from 'react';
import { hooks, requests, state, ui, utils } from '@application';
import {
  Conversation,
  createConversation,
  createMessage,
  getParticipant,
  User,
} from '@chess-tent/models';
import styled from '@emotion/styled';
import { selectConversationByUsers } from '../state/selectors';

const { Container, Headline3, Avatar, Text, Row, Col, Input } = ui;
const { generateIndex } = utils;
const {
  actions: { updateEntities, sendMessage },
} = state;
const {
  useApi,
  useComponentStateSilent,
  useActiveUserRecord,
  useConversationParticipant,
  useSelector,
  useDispatchBatched,
} = hooks;

const Close = styled.span({
  '&:before': {
    content: '"Close"',
  },
  // position: 'absolute',
  top: 0,
  right: 0,
});

const ConversationComponent = styled(
  ({ className, owner }: { className?: string; owner: User }) => {
    const { fetch: conversationSave } = useApi(requests.conversationSave);
    const dispatch = useDispatchBatched();
    const [participant, , clearParticipant] = useConversationParticipant();
    const conversation = useSelector(
      selectConversationByUsers(owner, participant),
    );
    const handleEnter = useCallback(
      event => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          // conversation
          const message = createMessage(
            generateIndex(),
            owner,
            event.target.value,
          );
          if (!conversation) {
            const newConversation = createConversation(
              generateIndex(),
              [owner, participant as User],
              [message],
            );
            conversationSave(newConversation);
            dispatch(updateEntities(newConversation));
          } else {
            dispatch(sendMessage(owner, conversation, message));
          }
        }
      },
      [conversation, conversationSave, dispatch, owner, participant],
    );
    if (!participant) {
      return null;
    }
    const messages = conversation?.messages;

    return (
      <Container className={className}>
        <Close onClick={clearParticipant} />
        <Row className="flex-grow-1">
          <Col>
            <Headline3>Conversation with {participant.name}</Headline3>
            {messages?.reduce<ReactElement[]>((result, message, index) => {
              const messageElement =
                message.owner !== owner.id ? (
                  <Container key={message.id} className="pl-0 pr-5">
                    {messages[index - 1]?.owner !== message.owner && (
                      <Avatar
                        size="small"
                        src={
                          getParticipant(
                            conversation as Conversation,
                            message.owner,
                          )?.imageUrl
                        }
                      />
                    )}
                    <Text>{message.message}</Text>
                  </Container>
                ) : (
                  <Text key={message.id} className="pr-0 pl-5 text-right">
                    {message.message}
                  </Text>
                );
              result.push(messageElement);
              return result;
            }, [])}
          </Col>
        </Row>
        <Row>
          <Col>
            <Input
              type="textarea"
              className="w-100"
              as="textarea"
              onKeyPress={handleEnter}
            />
          </Col>
        </Row>
      </Container>
    );
  },
)({
  position: 'absolute',
  top: 0,
  right: '100%',
  height: '100%',
  maxHeight: '100%',
  width: '100%',
  overflowY: 'auto',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-10px 10px 20px rgba(24, 34, 53, 0.1)',
  borderRight: '1px solid #E8E9EB',
});

export default () => {
  const dispatch = useDispatchBatched();
  const { mounted } = useComponentStateSilent();
  const { fetch: findConversations, response } = useApi(requests.conversations);
  const [activeUser] = useActiveUserRecord() as [User, never, never];

  useEffect(() => {
    !mounted && findConversations(activeUser.id);
  }, [mounted, findConversations, activeUser.id]);

  useEffect(() => {
    response && dispatch(updateEntities(response.data));
  }, [dispatch, response]);

  return (
    <Container className="h-100 overflow-y-auto">
      <Headline3>Messages</Headline3>
      <ConversationComponent owner={activeUser} />
      {response?.data.map(conversation => {
        const participant = conversation.users.find(
          user => user.id !== activeUser.id,
        ) as User;
        return (
          <Row>
            <Col>
              <Avatar src={participant.imageUrl} />
            </Col>
            <Col>
              <Text weight={700}>{participant.name}</Text>
              <Text>{conversation.messages[0]?.message}</Text>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};
