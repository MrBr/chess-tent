import { User } from '../user';
import { Conversation, TYPE_CONVERSATION } from './types';
import { Message } from '../message';
import { createService } from '../_helpers';

const createConversation = (
  id: string,
  users: User[],
  messages: Message[] = [],
): Conversation => ({
  id,
  type: TYPE_CONVERSATION,
  users,
  messages,
  lastMessageTimestamp: Date.now(),
});

const getParticipant = (conversation: Conversation, userId: User['id']) =>
  conversation.users.find(user => user.id === userId);

const getLatestMessage = (conversation: Conversation) =>
  conversation.messages[conversation.messages.length - 1];

const updateConversationMessage = createService(
  (draft: Conversation, message: Message): Conversation => {
    const messageIndex = draft.messages.findIndex(
      ({ id }) => id === message.id,
    );

    if (messageIndex > -1) {
      draft.messages[messageIndex] = message;
    }

    return draft;
  },
);

const addConversationMessage = createService(
  (draft: Conversation, message: Message): Conversation => {
    draft.messages.push(message);

    return draft;
  },
);

const isConversationRead = (conversation: Conversation, user: User) => {
  const lastMessage = getLatestMessage(conversation);
  return lastMessage ? user.id === lastMessage.owner || lastMessage.read : true;
};

export {
  createConversation,
  getParticipant,
  isConversationRead,
  getLatestMessage,
  updateConversationMessage,
  addConversationMessage,
};
