import {
  ConversationAction,
  ConversationState,
  SEND_MESSAGE,
  MessageAction,
} from '@types';
import { state } from '@application';
import { TYPE_CONVERSATION } from '@chess-tent/models';

export const reducer = (
  state: ConversationState = {},
  action: ConversationAction | MessageAction,
): ConversationState => {
  switch (action.type) {
    case SEND_MESSAGE: {
      const prevConversation = state[action.meta.conversationId];
      if (!prevConversation) {
        return state;
      }
      const conversation = {
        ...prevConversation,
        messages: [...prevConversation.messages, action.payload],
      };
      return {
        ...state,
        [conversation.id]: conversation,
      };
    }
    default: {
      return state;
    }
  }
};

state.registerEntityReducer(TYPE_CONVERSATION, reducer);
