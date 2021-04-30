import { User } from '../user';

export const TYPE_MESSAGE = 'messages';

export interface Message {
  id: string;
  conversationId: string;
  message: string;
  owner: User['id'];
  timestamp: number;
  read: boolean;
  type: typeof TYPE_MESSAGE;
}

export interface NormalizedMessage {
  id: Message['id'];
  conversationId: Message['conversationId'];
  message: Message['message'];
  owner: User['id'];
  timestamp: Message['timestamp'];
  read: Message['read'];
  type: typeof TYPE_MESSAGE;
}
