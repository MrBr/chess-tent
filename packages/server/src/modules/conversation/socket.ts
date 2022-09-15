import { socket } from '@application';
import { ACTION_EVENT, SEND_MESSAGE, UPDATE_ENTITY } from '@chess-tent/types';
import { Message, TYPE_MESSAGE } from '@chess-tent/models';
import {
  addMessageToConversation,
  getConversation,
  sendMessageNotificationViaEmail,
  shouldEmailMessage,
  updateConversationMessage,
} from './service';

socket.registerMiddleware(async (stream, next) => {
  if (stream.event === ACTION_EVENT && stream.data.type === SEND_MESSAGE) {
    const action = stream.data;
    const conversation = await getConversation(action.meta.conversationId);
    if (!conversation) {
      throw new Error('Sending message to non-existing conversation');
    }
    await addMessageToConversation(conversation.id, action.payload);
    const sender = conversation.users.find(
      ({ id }) => id === action.payload.owner,
    );
    const shouldSendEmail = shouldEmailMessage(conversation, action.payload);
    conversation.users.forEach(user => {
      if (sender && user.id !== sender.id) {
        socket.sendAction(`user-${user.id}`, stream);
        shouldSendEmail &&
          sendMessageNotificationViaEmail(
            sender,
            user,
            action.payload.message,
          ).catch(console.error);
      }
    });
  }
  if (
    stream.event === ACTION_EVENT &&
    stream.data.type === UPDATE_ENTITY &&
    stream.data.meta.type === TYPE_MESSAGE
  ) {
    const action = stream.data;
    const message = stream.data.payload.result as Message;
    updateConversationMessage(
      action.meta.conversationId,
      action.meta.id,
      message.timestamp,
      message,
    );
  }
  next(stream);
});
