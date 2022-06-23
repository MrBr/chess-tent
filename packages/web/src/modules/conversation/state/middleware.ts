import { Middleware, SEND_MESSAGE, UPDATE_ENTITY } from '@types';
import { requests, state, socket } from '@application';
import {
  Conversation,
  TYPE_MESSAGE,
  updateConversationMessage,
  addConversationMessage,
} from '@chess-tent/models';
import { selectConversation } from './selectors';
import { activeUserConversations } from '../records';

const { actions } = state;

const { updateEntity } = actions;

export const middleware: Middleware = store => next => action => {
  if (action.type === SEND_MESSAGE) {
    const state = store.getState();
    const record = activeUserConversations(store, 'conversations');
    const { conversationId } = action.meta;
    const conversation = selectConversation(conversationId)(state);
    if (conversation?.messages.length === 0) {
      // Starting new conversation

      requests.conversationSave(conversation).then(() => {
        record.push(addConversationMessage(conversation, action.payload));
        socket.sendAction(action);
      });
    } else if (!action.meta.push) {
      socket.sendAction(action);
    }
    if (!conversation) {
      requests.conversation(conversationId).then(response => {
        record.push(response.data);
      });
    }
  }
  if (
    action.type === UPDATE_ENTITY &&
    action.meta.type === TYPE_MESSAGE &&
    !action.meta.push
  ) {
    const conversation = selectConversation(action.meta.conversationId)(
      store.getState(),
    ) as Conversation;
    if (!conversation) {
      console.warn('Updating message without conversationId.');
    } else {
      const updatedConversation = updateConversationMessage(
        conversation,
        action.payload.result,
      );
      store.dispatch(updateEntity(updatedConversation));
    }
    socket.sendAction(action);
  }
  next(action);
};
