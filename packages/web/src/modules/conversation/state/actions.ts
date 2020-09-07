import { SEND_MESSAGE, SendMessageAction } from '@types';
import { Conversation, Message, User } from '@chess-tent/models';

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
