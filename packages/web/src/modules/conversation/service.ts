import { services } from '@application';
import { Conversation, TYPE_CONVERSATION } from '@chess-tent/models';

export const conversationRecordService = services.createRecordService<
  Conversation[]
>('conversations', TYPE_CONVERSATION);
