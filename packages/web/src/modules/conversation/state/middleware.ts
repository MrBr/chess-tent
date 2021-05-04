import { Middleware, SEND_MESSAGE, UPDATE_MESSAGE } from '@types';
import { requests, state, socket } from '@application';
import { selectConversation } from './selectors';
import { conversationRecordService } from '../service';

const { actions } = state;

const { updateEntities } = actions;

export const middleware: Middleware = store => next => action => {
  if (action.type === SEND_MESSAGE) {
    const state = store.getState();
    const { record, updateValue } = conversationRecordService(store);
    const { conversationId } = action.meta;
    const conversation = selectConversation(conversationId)(state);
    if (conversation?.messages.length === 0) {
      // Starting new conversation
      requests.conversationSave(conversation).then(() => {
        updateValue([conversation.id, ...record.value]);
        socket.sendAction(action);
      });
    } else if (!action.meta.push) {
      socket.sendAction(action);
    }
    if (!conversation) {
      requests.conversation(conversationId).then(response => {
        store.dispatch(updateEntities(response.data));
        updateValue([conversationId, ...record.value]);
      });
    }
  }
  if (action.type === UPDATE_MESSAGE && !action.meta.push) {
    socket.sendAction(action);
  }
  next(action);
};
