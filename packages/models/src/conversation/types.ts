import { User } from '../user';
import { NormalizedMessage } from '../message';

export const TYPE_CONVERSATION = 'conversations';

export interface Conversation {
  id: string;
  users: User[];
  messages: NormalizedMessage[];
  type: typeof TYPE_CONVERSATION;
}

export interface NormalizedConversation {
  id: Conversation['id'];
  users: User['id'][];
  messages: NormalizedMessage[];
  type: Conversation['type'];
}
