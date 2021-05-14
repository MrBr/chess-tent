import { Middleware, SEND_MESSAGE, UPDATE_ENTITY } from '@types';
import { requests, state, socket } from '@application';
import {
  Conversation,
  TYPE_MESSAGE,
  updateConversationMessage,
} from '@chess-tent/models';
import { selectConversation } from './selectors';
import { conversationRecordService } from '../service';

const { actions } = state;

const { updateEntities, updateEntity } = actions;

export const middleware: Middleware = store => next => action => {
  if (action.type === SEND_MESSAGE) {
    const state = store.getState();
    const { record, updateValue } = conversationRecordService(store);
    const { conversationId } = action.meta;
    const conversation = selectConversation(conversationId)(state);
    if (conversation?.messages.length === 0) {
      // Starting new conversation
      requests.conversationSave(conversation).then(() => {
        updateValue([conversation.id, ...(record.value || [])]);
        socket.sendAction(action);
      });
    } else if (!action.meta.push) {
      socket.sendAction(action);
    }
    if (!conversation) {
      requests.conversation(conversationId).then(response => {
        store.dispatch(updateEntities(response.data));
        updateValue([conversationId, ...(record.value || [])]);
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
        action.payload,
      );
      store.dispatch(updateEntity(updatedConversation));
    }
    socket.sendAction(action);
  }
  next(action);
};
