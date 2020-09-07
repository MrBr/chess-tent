import { Middleware, SEND_MESSAGE } from '@types';
import { requests, state, socket } from '@application';

const {
  actions: { updateEntities },
} = state;

export const middleware: Middleware = store => next => action => {
  if (action.type === SEND_MESSAGE) {
    const state = store.getState();
    const conversationId = action.meta.conversationId;
    const conversation = state.entities.conversations[conversationId];
    if (!conversation) {
      requests.conversation(conversationId).then(response => {
        store.dispatch(updateEntities(response.data));
      });
    }
    if (!action.meta.push) {
      socket.sendAction(action);
    }
  }
  next(action);
};
