import { records, requests } from '@application';
import {
  Conversation,
  TYPE_CONVERSATION,
  TYPE_USER,
  User,
} from '@chess-tent/models';

const activeUserConversations = records.createRecord(
  records.withRecordBase<Conversation[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_CONVERSATION),
  records.withRecordApiLoad(requests.conversations),
);

const conversationParticipant = records.createRecord(
  records.withRecordBase<User>(),
  records.withRecordDenormalized(TYPE_USER),
);

export { activeUserConversations, conversationParticipant };
