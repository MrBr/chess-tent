import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { hooks, requests, state, ui, utils } from '@application';
import {
  Conversation,
  createMessage,
  getParticipant,
  User,
} from '@chess-tent/models';
import styled from '@emotion/styled';
import { DateTime } from 'luxon';

const { Container, Headline3, Avatar, Text, Row, Col, Input } = ui;
const { generateIndex } = utils;
const {
  actions: { updateEntities, sendMessage },
} = state;
const { useApi, useDispatchBatched } = hooks;

const Close = styled.span({
  '&:before': {
    content: '"x"',
  },
  position: 'absolute',
  top: 10,
  right: 20,
});

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
  useEffect(() => {
    console.log('Load more: ', inView, loading, noMore);
    inView && !loading && !noMore && loadMore();
  }, [inView, loadMore, loading, noMore]);
  return (
    <div ref={ref}>{loading ? 'Loading...' : noMore ? 'No more' : '?'}</div>
  );
};

const useLoadMoreMessages = (
  conversation: Conversation,
): [() => void, boolean, boolean] => {
  const dispatch = useDispatchBatched();
  const [noMore, setNoMore] = useState(conversation.messages.length === 0);
  const { fetch, response, loading, reset } = useApi(requests.messages);
  useEffect(() => {
    if (response) {
      reset();
      if (response.data.length < 10) {
        setNoMore(true);
      }
      dispatch(
        updateEntities({
          ...conversation,
          messages: [...conversation.messages, ...response.data],
        }),
      );
    }
  }, [response, dispatch, conversation, reset]);
  const messageCount = conversation.messages.length;
  const loadMore = useCallback(() => {
    if (noMore || loading) {
      return;
    }
    fetch(conversation.id, [messageCount + 1, 10]);
  }, [conversation.id, messageCount, fetch, noMore, loading]);
  return [loadMore, loading || !!response, noMore];
};

export default styled(
  ({
    className,
    owner,
    participant,
    conversation,
    close,
  }: {
    className?: string;
    owner: User;
    participant: User;
    conversation: Conversation;
    close: () => void;
  }) => {
    const dispatch = useDispatchBatched();
    const [loadMoreMessages, loading, noMore] = useLoadMoreMessages(
      conversation,
    );
    const { messages } = conversation;

    const handleEnter = useCallback(
      event => {
        if (event.key !== 'Enter' || event.shiftKey) {
          return;
        }
        event.preventDefault();
        // conversation
        const message = createMessage(
          generateIndex(),
          owner,
          event.target.value,
        );
        event.target.value = '';
        dispatch(sendMessage(owner, conversation, message));
      },
      [conversation, dispatch, owner],
    );

    return (
      <Container className={`${className} pl-5 pr-5 pb-3`}>
        <Close onClick={close} />
        <Row className="flex-grow-1">
          <Col>
            <Headline3 className="mb-5">
              Conversation with {participant.name}
            </Headline3>
            <LoadMore
              loadMore={loadMoreMessages}
              loading={loading}
              noMore={noMore}
            />
            {messages?.reduce<ReactElement[]>((result, message, index) => {
              const messageElement =
                message.owner !== owner.id ? (
                  <Container key={message.id} className="pl-0">
                    {messages[index - 1]?.owner !== message.owner && (
                      <>
                        <Avatar
                          size="small"
                          src={
                            getParticipant(
                              conversation as Conversation,
                              message.owner,
                            )?.imageUrl
                          }
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
        <Row>
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
