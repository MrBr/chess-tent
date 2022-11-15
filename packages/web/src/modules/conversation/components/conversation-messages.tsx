import React, { ReactElement, useCallback, useEffect } from 'react';
import { components, hooks, state, ui, utils } from '@application';
import {
  Conversation,
  createMessage,
  getParticipant,
  updateMessage,
  User,
} from '@chess-tent/models';
import last from 'lodash/last';

import useLoadMoreMessages from '../hooks/useLoadMoreMessages';
import ConversationMessage from './conversation-message';

const { Row, Col, Input, LoadMore, Offcanvas } = ui;
const { UserAvatar } = components;
const { generateIndex } = utils;
const {
  actions: { sendMessage, updateEntity },
} = state;
const { useDispatchBatched } = hooks;

interface ConversationMessagesProps {
  activeUser: User;
  conversation: Conversation;
}

const ConversationMessages = ({
  activeUser,
  conversation,
}: ConversationMessagesProps) => {
  const dispatch = useDispatchBatched();
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
    <Offcanvas.Body className="h-100 d-flex flex-column">
      <Row className="flex-grow-1 overflow-y-auto pl-3 pr-3 pb-3 flex-column-reverse">
        <Col className="overflow-anchor-none d-flex flex-column">
          <LoadMore
            loadMore={loadMoreMessages}
            loading={loading}
            noMore={noMore}
          />
          {messages?.reduce<ReactElement[]>((result, message, index) => {
            const prevMessage = messages[index - 1];
            const messageOwner = getParticipant(
              conversation,
              message.owner,
            ) as User;

            result.push(
              <ConversationMessage
                message={message.message}
                activeUser={activeUser}
                messageOwner={messageOwner}
                prevMessage={prevMessage}
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
  );
};

export default ConversationMessages;
