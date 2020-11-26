import {
  ConversationAction,
  ConversationState,
  UPDATE_ENTITIES,
  SEND_MESSAGE,
  UPDATE_MESSAGE,
  MessageAction,
} from '@types';

export const reducer = (
  state: ConversationState = {},
  action: ConversationAction | MessageAction,
): ConversationState => {
  switch (action.type) {
    case UPDATE_MESSAGE: {
      const { conversationId, messageId } = action.meta;
      const prevConversation = state[conversationId];
      if (!prevConversation) {
        return state;
      }
      const conversation = {
        ...prevConversation,
        messages: prevConversation.messages.map(message =>
          message.id === messageId
            ? { ...message, ...action.payload }
            : message,
        ),
      };
      return {
        ...state,
        [conversationId]: conversation,
      };
    }
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
