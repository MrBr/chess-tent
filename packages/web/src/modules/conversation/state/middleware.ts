import { Middleware, SEND_MESSAGE, UPDATE_MESSAGE } from '@types';
import { requests, state, socket, utils } from '@application';
import { TYPE_CONVERSATION } from '@chess-tent/models';
import { updateActiveUserConversations } from './actions';

const {
  selectors: { selectRecord },
  actions,
} = state;

const { updateEntities } = actions;

export const middleware: Middleware = store => next => action => {
  if (action.type === SEND_MESSAGE) {
    const state = store.getState();
    const conversations = selectRecord('conversations')(state)
      .value as string[];
    const conversationId = action.meta.conversationId;
    const conversation = state.entities.conversations[conversationId];
    if (conversation?.messages.length === 0) {
      // Starting new conversation
      requests
        .conversationSave(
          utils.denormalize(conversation.id, TYPE_CONVERSATION, state.entities),
        )
        .then(() => {
          store.dispatch(
            updateActiveUserConversations([conversationId, ...conversations]),
          );
          socket.sendAction(action);
        });
    } else if (!action.meta.push) {
      socket.sendAction(action);
    }
    if (!conversation) {
      requests.conversation(conversationId).then(response => {
        store.dispatch(updateEntities(response.data));
        store.dispatch(
          updateActiveUserConversations([conversationId, ...conversations]),
        );
      });
    }
  }
  if (action.type === UPDATE_MESSAGE && !action.meta.push) {
    socket.sendAction(action);
  }
  next(action);
};
