import { ConversationState, LessonAction, UPDATE_ENTITIES } from '@types';

export const reducer = (
  state: ConversationState = {},
  action: LessonAction,
): ConversationState => {
  switch (action.type) {
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
