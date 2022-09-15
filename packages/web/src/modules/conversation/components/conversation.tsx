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
import last from 'lodash/last';
import useLoadMoreMessages from '../hooks/useLoadMoreMessages';
import ConversationMessage from './conversation-message';

const { Headline5, Row, Col, Input, Icon, LoadMore, Offcanvas } = ui;
const { UserAvatar, MentorshipButton } = components;
const { generateIndex } = utils;
const {
  actions: { sendMessage, updateEntity },
} = state;
const { useDispatchBatched, useHistory } = hooks;

export default styled<{
  className?: string;
  activeUser: User;
  participant: User;
  conversation: Conversation;
  close: () => void;
}>(({ activeUser, participant, conversation, close }) => {
  const dispatch = useDispatchBatched();
  const history = useHistory();
  const [loadMoreMessages, loading, noMore] = useLoadMoreMessages(conversation);
  const { messages } = conversation;

  useEffect(() => {
    const lastMessage = last(messages);
    if (
      !loading &&
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
  }, [activeUser.id, conversation.id, dispatch, loading, messages]);

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
      <Offcanvas.Header closeButton={false} className="flex-column">
        <Row className="g-0 align-items-center w-100">
          <Col className="col-auto me-1">
            <Icon type="left" size="extra-small" onClick={close} />
          </Col>
          <Col className="col-auto me-1">
            <UserAvatar user={participant} size="small" />
          </Col>
          <Col
            onClick={() => history.push(`/user/${participant.id}`)}
            className="cursor-pointer"
          >
            <Headline5 className="m-0">{participant.name}</Headline5>
          </Col>
        </Row>
        <Row className="w-100">
          <Col>
            <MentorshipButton user={participant} className="mt-4" />
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
              const messageOwner = getParticipant(
                conversation,
                message.owner,
              ) as User;
              const lastMessageOwner = getParticipant(
                conversation,
                messages[index - 1]?.owner,
              );

              result.push(
                <ConversationMessage
                  message={message.message}
                  activeUser={activeUser}
                  messageOwner={messageOwner}
                  lastMessageOwner={lastMessageOwner}
                  timestamp={message.timestamp}
                  key={message.id}
                />,
              );
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
              type="text"
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
