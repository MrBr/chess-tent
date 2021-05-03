import { useCallback, useEffect, useState } from 'react';
import { hooks, requests, services, state } from '@application';
import {
  Conversation,
  TYPE_CONVERSATION,
  TYPE_USER,
  User,
} from '@chess-tent/models';
import { RecordHookReturn } from '@types';
import last from 'lodash/last';

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
          messages: [...conversation.messages, ...response.data],
        }),
      );
    }
  }, [response, dispatch, conversation, reset]);
  const loadMore = useCallback(() => {
    if (noMore || loading) {
      return;
    }
    const lastMessage = last(conversation.messages);
    fetch(conversation.id, lastMessage?.timestamp);
  }, [noMore, loading, conversation.messages, conversation.id, fetch]);
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
