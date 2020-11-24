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
  User,
} from '@chess-tent/models';

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
): UpdateMessageAction => ({
  type: UPDATE_MESSAGE,
  payload: message,
  meta: {
    conversationId,
    messageId,
  },
});
