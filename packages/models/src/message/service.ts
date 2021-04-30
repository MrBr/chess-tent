import { User } from '../user';
import { Message, TYPE_MESSAGE } from './types';

const createMessage = (
  id: string,
  conversationId: string,
  owner: User,
  message: string,
  read = false,
): Message => ({
  id,
  conversationId,
  type: TYPE_MESSAGE,
  owner: owner.id,
  message,
  read,
  timestamp: Date.now(),
});

export { createMessage };
