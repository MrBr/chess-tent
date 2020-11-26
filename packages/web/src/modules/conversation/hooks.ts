import { useEffect } from 'react';
import { hooks, requests, services } from '@application';
import { Conversation, User } from '@chess-tent/models';
import { RecordHookReturn } from '@types';

const { useApi, useRecord } = hooks;

export const useConversationParticipant = services.createRecordHook<User>(
  'conversationParticipant',
);

export const useUserConversations = (
  userId: User['id'],
): RecordHookReturn<Conversation[]> => {
  const [conversations, setConversations, resetConversations] = useRecord<
    Conversation[]
  >(`conversations`);
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
