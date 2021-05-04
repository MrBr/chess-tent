import { socket } from '@application';
import { ACTION_EVENT, SEND_MESSAGE, UPDATE_MESSAGE } from '@chess-tent/types';
import {
  addMessageToConversation,
  getConversation,
  updateConversationMessage,
} from './service';

socket.registerMiddleware(async (stream, next) => {
  if (stream.event === ACTION_EVENT && stream.data.type === SEND_MESSAGE) {
    const action = stream.data;
    const conversation = await getConversation(action.meta.conversationId);
    addMessageToConversation(conversation.id, action.payload);
    conversation.users.forEach(user => {
      user.id !== action.payload.owner &&
        socket.sendAction(`user-${user.id}`, stream);
    });
  }
  if (stream.event === ACTION_EVENT && stream.data.type === UPDATE_MESSAGE) {
    const action = stream.data;
    updateConversationMessage(
      action.meta.conversationId,
      action.meta.messageId,
      action.meta.messageTimestamp,
      action.payload,
    );
  }
  next(stream);
});
