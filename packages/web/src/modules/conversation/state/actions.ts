import { SEND_MESSAGE, SendMessageAction } from '@types';
import {
  Conversation,
  Message,
  TYPE_CONVERSATION,
  User,
} from '@chess-tent/models';

import { state } from '@application';

const {
  actions: { updateRecordValue },
} = state;

export const sendMessage = (
  user: User,
  conversation: Conversation,
  message: Message,
): SendMessageAction => ({
  type: SEND_MESSAGE,
  payload: message,
  meta: {
    conversationId: conversation.id,
  },
});

export const updateActiveUserConversations = (
  conversations: Conversation['id'][],
) => updateRecordValue('conversations', conversations, TYPE_CONVERSATION);
