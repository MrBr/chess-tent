import { useCallback, useEffect, useState } from 'react';
import { hooks, requests, state } from '@application';
import { Conversation } from '@chess-tent/models';
import first from 'lodash/first';

const { useApi, useDispatch } = hooks;
const {
  actions: { updateEntities },
} = state;

const useLoadMoreMessages = (
  conversation: Conversation,
): [() => void, boolean, boolean] => {
  const dispatch = useDispatch();
  const [noMore, setNoMore] = useState(conversation.messages.length === 0);
  const { fetch, response, loading, reset } = useApi(requests.messages);
  useEffect(() => {
    if (response) {
      reset();
      if (response.data.length === 0) {
        setNoMore(true);
      }
      dispatch(
        updateEntities({
          ...conversation,
          messages: [...response.data, ...conversation.messages],
        }),
      );
    }
  }, [response, dispatch, conversation, reset]);
  const loadMore = useCallback(() => {
    const firstMessage = first(conversation.messages);
    if (noMore || loading || !firstMessage) {
      return;
    }
    fetch(conversation.id, firstMessage.timestamp);
  }, [noMore, loading, conversation.messages, conversation.id, fetch]);
  return [loadMore, loading || !!response, noMore];
};

export default useLoadMoreMessages;
