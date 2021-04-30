import { User } from '../user';
import { Message, TYPE_MESSAGE } from './types';

const createMessage = (
  id: string,
  owner: User,
  message: string,
  read = false,
): Message => ({
  id,
  type: TYPE_MESSAGE,
  owner: owner.id,
  message,
  read,
  timestamp: Date.now(),
});

export { createMessage };
