import { useCallback, useEffect, useState } from 'react';
import { hooks, requests, services, state } from '@application';
import {
  Conversation,
  TYPE_CONVERSATION,
  TYPE_USER,
  User,
} from '@chess-tent/models';
import { RecordHookReturn } from '@types';

const { useApi, useRecord, useDispatch } = hooks;
const {
  actions: { updateEntities },
} = state;

export const useConversationParticipant = services.createRecordHook<User>(
  'conversationParticipant',
  TYPE_USER,
);

export const useLoadMoreMessages = (
  conversation: Conversation,
  pageSize: number,
): [() => void, boolean, boolean] => {
  const dispatch = useDispatch();
  const [noMore, setNoMore] = useState(conversation.messages.length === 0);
  const { fetch, response, loading, reset } = useApi(requests.messages);
  useEffect(() => {
    if (response) {
      reset();
      if (response.data.length < pageSize) {
        setNoMore(true);
      }
      dispatch(
        updateEntities({
          ...conversation,
          messages: [...conversation.messages, ...response.data],
        }),
      );
    }
  }, [response, dispatch, conversation, reset, pageSize]);
  const messageCount = conversation.messages.length;
  const loadMore = useCallback(() => {
    if (noMore || loading) {
      return;
    }
    fetch(conversation.id, [messageCount + 1, pageSize]);
  }, [noMore, loading, fetch, conversation.id, messageCount, pageSize]);
  return [loadMore, loading || !!response, noMore];
};

export const useUserConversations = (
  userId: User['id'],
): RecordHookReturn<Conversation[]> => {
  const [conversations, setConversations, resetConversations] = useRecord<
    Conversation[]
  >('conversations', TYPE_CONVERSATION);
  const { fetch, response, loading, error, reset } = useApi(
    requests.conversations,
  );
  useEffect(() => {
    if (!response || conversations) {
      return;
    }
    setConversations(response.data);
  }, [reset, response, setConversations, conversations]);
  useEffect(() => {
    if (loading || response || error || conversations) {
      return;
    }
    fetch(userId);
  }, [fetch, loading, response, error, conversations, userId]);
  return [conversations, setConversations, resetConversations];
};
