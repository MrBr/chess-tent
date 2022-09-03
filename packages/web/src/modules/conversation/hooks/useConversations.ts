import { useEffect } from 'react';
import { Conversation, isConversationRead, User } from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import { hooks, records } from '@application';

import { selectConversationByUsers } from '../state/selectors';

const { useSelector, useRecordInit, useActiveUserRecord } = hooks;

export const useConversations = (
  participant?: User,
): [RecordValue<Conversation[]>, Conversation | null, boolean] => {
  const { value: activeUser } = useActiveUserRecord();
  const {
    value: conversations,
    load,
    meta: { loading, userId },
    amend,
  } = useRecordInit(records.activeUserConversations, 'conversations');

  const conversation = useSelector(
    selectConversationByUsers(activeUser, participant),
  );
  const haveUnreadMessages = !conversations?.every(conversation =>
    isConversationRead(conversation, activeUser),
  );

  useEffect(() => {
    amend({ userId: activeUser.id });
  }, [activeUser.id, amend]);

  useEffect(() => {
    if (loading || conversations || !userId) {
      return;
    }
    load(userId, { skip: 0, limit: 5 });
  }, [load, userId, loading, conversations]);

  return [conversations, conversation, haveUnreadMessages];
};
