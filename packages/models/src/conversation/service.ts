import { User } from "../user";
import { Conversation, TYPE_CONVERSATION } from "./types";
import { Message } from "../message";

const createConversation = (
  id: string,
  users: User[],
  messages: Message[] = []
): Conversation => ({
  id,
  type: TYPE_CONVERSATION,
  users,
  messages
});

const addMessageToConversation = (
  conversation: Conversation,
  message: Message
): Conversation => ({
  ...conversation,
  messages: [...conversation.messages, message]
});

export { createConversation, addMessageToConversation };
