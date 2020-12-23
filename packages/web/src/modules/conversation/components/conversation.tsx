import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { components, hooks, state, ui, utils } from '@application';
import {
  Conversation,
  createMessage,
  getParticipant,
  User,
} from '@chess-tent/models';
import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import { updateMessage } from '../state/actions';
import { useLoadMoreMessages } from '../hooks';

const { Container, Headline3, Text, Row, Col, Input, Icon, Absolute } = ui;
const { UserAvatar, MentorshipButton } = components;
const { generateIndex } = utils;
const {
  actions: { sendMessage },
} = state;
const { useDispatchBatched } = hooks;

const ActiveUserMessages = styled(Text)({
  background: '#F3F4F5',
  borderRadius: 16,
  padding: '1em',
  textAlign: 'right',
});

const LoadMore = ({
  loading,
  loadMore,
  noMore,
}: {
  loadMore: () => void;
  loading: boolean;
  noMore: boolean;
}) => {
  const { ref, inView } = useInView();
  // Ready is used to debounce load more so that dom can actually rerender and hide "LoadMore"
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    inView && !loading && !noMore && setTimeout(() => setReady(true), 50);
  }, [inView, loadMore, loading, noMore]);
  useEffect(() => {
    if (inView && !loading && !noMore && ready) {
      setReady(false);
      loadMore();
    }
  }, [inView, loadMore, loading, noMore, ready]);
  return <div ref={ref}>{loading ? 'Loading...' : ''}</div>;
};

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
    const [loadMoreMessages, loading, noMore] = useLoadMoreMessages(
      conversation,
      10,
    );
    const { messages } = conversation;

    useEffect(() => {
      if (
        messages[0] &&
        !messages[0].read &&
        messages[0].owner !== activeUser.id
      ) {
        dispatch(
          updateMessage({ read: true }, conversation.id, messages[0].id),
        );
      }
    }, [activeUser.id, conversation, dispatch, messages]);

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
          <Col>
            <LoadMore
              loadMore={loadMoreMessages}
              loading={loading}
              noMore={noMore}
            />
            {messages?.reduce<ReactElement[]>((result, message, index) => {
              const messageElement =
                message.owner !== activeUser.id ? (
                  <Container key={message.id} className="pl-0">
                    {messages[index + 1]?.owner !== message.owner && (
                      <>
                        <UserAvatar
                          size="small"
                          user={getParticipant(
                            conversation as Conversation,
                            message.owner,
                          )}
                        />
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
              result.unshift(messageElement);
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
