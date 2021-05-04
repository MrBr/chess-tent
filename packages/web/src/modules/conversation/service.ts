import { services } from '@application';
import { Conversation } from '@chess-tent/models';

export const conversationRecordService = services.createRecordService<
  Conversation[]
>('conversations');
