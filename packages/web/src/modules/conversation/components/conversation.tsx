import React, { ReactElement, useCallback, useEffect } from 'react';
import { components, hooks, state, ui, utils } from '@application';
import {
  Conversation,
  createMessage,
  getParticipant,
  updateMessage,
  User,
} from '@chess-tent/models';
import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import last from 'lodash/last';
import useLoadMoreMessages from '../hooks/useLoadMoreMessages';

const {
  Container,
  Headline3,
  Text,
  Row,
  Col,
  Input,
  Icon,
  Absolute,
  LoadMore,
} = ui;
const { UserAvatar, MentorshipButton } = components;
const { generateIndex } = utils;
const {
  actions: { sendMessage, updateEntity },
} = state;
const { useDispatchBatched } = hooks;

const ActiveUserMessages = styled(Text)({
  background: '#F3F4F5',
  borderRadius: 16,
  padding: '1em',
  alignSelf: 'end',
});

export default styled(
  ({
    className,
    activeUser,
    participant,
    conversation,
    close,
  }: {
    className?: string;
    activeUser: User;
    participant: User;
    conversation: Conversation;
    close: () => void;
  }) => {
    const dispatch = useDispatchBatched();
    const [loadMoreMessages, loading, noMore] =
      useLoadMoreMessages(conversation);
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
      <Container className={`${className} pb-3`}>
        <Absolute top={10} right={20} zIndex={2}>
          <Icon type="close" onClick={close} />
        </Absolute>
        <Row>
          <Col>
            <MentorshipButton user={participant} className="mt-3" />
            <Headline3 className="mb-5 mt-3">{participant.name}</Headline3>
          </Col>
        </Row>
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
                          className="ml-3"
                        >
                          {DateTime.fromMillis(
                            message.timestamp,
                          ).toLocaleString(DateTime.TIME_24_SIMPLE)}
                        </Text>
                      </>
                    )}
                    <Text className="pl-4 mt-1" fontSize="small">
                      {message.message}
                    </Text>
                  </Container>
                ) : (
                  <ActiveUserMessages key={message.id} fontSize="extra-small">
                    {message.message}
                  </ActiveUserMessages>
                );
              result.push(messageElement);
              return result;
            }, [])}
          </Col>
        </Row>
        <Row className="pr-3 pl-3">
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
      </Container>
    );
  },
)({
  position: 'absolute',
  top: 0,
  right: '100%',
  height: '100%',
  maxHeight: '100%',
  width: '120%',
  overflowY: 'auto',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-10px 10px 20px rgba(24, 34, 53, 0.1)',
  borderRight: '1px solid #E8E9EB',
});
