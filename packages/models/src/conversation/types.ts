import { User } from '../user';
import { Message, NormalizedMessage } from '../message';

export const TYPE_CONVERSATION = 'conversations';

export interface Conversation {
  id: string;
  users: User[];
  messages: Message[];
  type: typeof TYPE_CONVERSATION;
}

export interface NormalizedConversation {
  id: Conversation['id'];
  users: User['id'][];
  messages: NormalizedMessage[];
  type: Conversation['type'];
}
