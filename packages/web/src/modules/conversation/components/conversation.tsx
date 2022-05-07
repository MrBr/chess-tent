import React, { ReactElement, useCallback, useEffect } from 'react';
import { components, hooks, state, ui, utils } from '@application';
import {
  Conversation,
  createMessage,
  getParticipant,
  updateMessage,
  User,
} from '@chess-tent/models';
import styled from '@chess-tent/styled-props';
import { DateTime } from 'luxon';
import last from 'lodash/last';
import useLoadMoreMessages from '../hooks/useLoadMoreMessages';
import UserMessages from './user-messages';

const {
  Container,
  Headline5,
  Text,
  Row,
  Col,
  Input,
  Icon,
  LoadMore,
  Offcanvas,
} = ui;
const { UserAvatar, MentorshipButton } = components;
const { generateIndex } = utils;
const {
  actions: { sendMessage, updateEntity },
} = state;
const { useDispatchBatched } = hooks;

export default styled<{
  className?: string;
  activeUser: User;
  participant: User;
  conversation: Conversation;
  close: () => void;
}>(({ className, activeUser, participant, conversation, close }) => {
  const dispatch = useDispatchBatched();
  const [loadMoreMessages, loading, noMore] = useLoadMoreMessages(conversation);
  const { messages } = conversation;

  useEffect(() => {
    const lastMessage = last(messages);
    if (
      lastMessage &&
      !lastMessage.read &&
      lastMessage.owner !== activeUser.id
    ) {
      const updatedMessage = updateMessage(lastMessage, {
        read: true,
      });
      dispatch(
        updateEntity(updatedMessage, { conversationId: conversation.id }),
      );
    }
  }, [activeUser.id, conversation.id, dispatch, messages]);

  const handleEnter = useCallback(
    event => {
      if (event.key !== 'Enter' || event.shiftKey) {
        return;
      }
      event.preventDefault();
      // conversation
      const message = createMessage(
        generateIndex(),
        activeUser,
        event.target.value,
      );
      event.target.value = '';
      dispatch(sendMessage(activeUser, conversation, message));
    },
    [conversation, dispatch, activeUser],
  );

  return (
    <>
      <Offcanvas.Header>
        <Row className="g-0 align-items-center">
          <Col className="col-auto me-1">
            <Icon type="left" size="extra-small" onClick={close} />
          </Col>
          <Col className="col-auto me-1">
            <UserAvatar user={participant} size="small" />
          </Col>
          <Col>
            <Headline5 className="m-0">{participant.name}</Headline5>
          </Col>
        </Row>
        <Row>
          <Col>
            <MentorshipButton user={participant} className="mt-3" />
          </Col>
        </Row>
      </Offcanvas.Header>
      <Offcanvas.Body className="h-100 d-flex flex-column">
        <Row className="flex-grow-1 overflow-y-auto pl-3 pr-3 pb-3 flex-column-reverse">
          <Col className="overflow-anchor-none d-flex flex-column">
            <LoadMore
              loadMore={loadMoreMessages}
              loading={loading}
              noMore={noMore}
            />
            {messages?.reduce<ReactElement[]>((result, message, index) => {
              const messageOwner = getParticipant(conversation, message.owner);
              const messageElement =
                message.owner !== activeUser.id ? (
                  <Container key={message.id} className="pl-0">
                    {messages[index - 1]?.owner !== message.owner && (
                      <>
                        {messageOwner && (
                          <UserAvatar size="small" user={messageOwner} />
                        )}
                        <Text
                          inline
                          fontSize="extra-small"
                          weight={700}
                          className="ms-3"
                        >
                          {DateTime.fromMillis(
                            message.timestamp,
                          ).toLocaleString(DateTime.TIME_24_SIMPLE)}
                        </Text>
                      </>
                    )}
                    <UserMessages className="pl-4 mt-1" variant="tertiary">
                      {message.message}
                    </UserMessages>
                  </Container>
                ) : (
                  <UserMessages key={message.id}>
                    {message.message}
                  </UserMessages>
                );
              result.push(messageElement);
              return result;
            }, [])}
          </Col>
        </Row>
        <Row className="pr-3 pl-3 align-items-center">
          <Col className="col-auto">
            <UserAvatar size="small" user={activeUser} />
          </Col>
          <Col>
            <Input
              type="textarea"
              className="w-100"
              as="textarea"
              placeholder="Type here"
              onKeyPress={handleEnter}
            />
          </Col>
        </Row>
      </Offcanvas.Body>
    </>
  );
}).css`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  max-height: 100%;
  width: 100%;
  overflow-y: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 10px 20px rgba(24, 34, 53, 0.1);
  border-right: 1px solid #E8E9EB;
`;
