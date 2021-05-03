import {
  SEND_MESSAGE,
  SendMessageAction,
  UPDATE_MESSAGE,
  UpdateMessageAction,
} from '@types';
import {
  Conversation,
  Message,
  NormalizedMessage,
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

export const updateMessage = (
  message: Partial<NormalizedMessage>,
  conversationId: Conversation['id'],
  messageId: NormalizedMessage['id'],
  messageTimestamp: NormalizedMessage['timestamp'],
): UpdateMessageAction => ({
  type: UPDATE_MESSAGE,
  payload: message,
  meta: {
    conversationId,
    messageId,
    messageTimestamp,
  },
});

export const updateActiveUserConversations = (
  conversations: Conversation['id'][],
) => updateRecordValue('conversations', conversations, TYPE_CONVERSATION);
