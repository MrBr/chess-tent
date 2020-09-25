import {
  ConversationAction,
  ConversationState,
  UPDATE_ENTITIES,
  SEND_MESSAGE,
} from '@types';

export const reducer = (
  state: ConversationState = {},
  action: ConversationAction,
): ConversationState => {
  switch (action.type) {
    case SEND_MESSAGE: {
      const prevConversation = state[action.meta.conversationId];
      if (!prevConversation) {
        return state;
      }
      const conversation = {
        ...prevConversation,
        messages: [action.payload, ...prevConversation.messages],
      };
      return {
        ...state,
        [conversation.id]: conversation,
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.conversations
        ? {
            ...state,
            ...action.payload.conversations,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
