import { User } from '../user';
import { Message, TYPE_MESSAGE } from './types';
import { createService } from '../_helpers';

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

const updateMessage = createService(
  (draft: Message, patch: Partial<Message>): Message => {
    Object.assign(draft, patch);
    return draft;
  },
);

export { createMessage, updateMessage };
