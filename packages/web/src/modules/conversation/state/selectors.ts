import { AppState } from '@types';
import { Conversation, TYPE_CONVERSATION, User } from '@chess-tent/models';
import { utils } from '@application';

export const selectConversation = (conversationId: Conversation['id']) => (
  state: AppState,
): Conversation | null =>
  utils.denormalize(conversationId, TYPE_CONVERSATION, state.entities);

export const selectConversationByUsers = (
  ...users: (User | null | undefined)[]
) => (state: AppState): Conversation | null => {
  if (users.every(Boolean) && users.length < 2) {
    return null;
  }
  const conversation = Object.values(
    state.entities.conversations,
  ).find(conversation =>
    users.every(user => conversation.users.some(userId => user?.id === userId)),
  );
  return conversation
    ? utils.denormalize(conversation.id, TYPE_CONVERSATION, state.entities)
    : null;
};
