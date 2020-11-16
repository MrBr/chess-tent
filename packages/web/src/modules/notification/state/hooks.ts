import { services } from '@application';
import { User } from '@chess-tent/models';

export const useConversationParticipant = services.createRecordHook<User>(
  'conversationParticipant',
);
