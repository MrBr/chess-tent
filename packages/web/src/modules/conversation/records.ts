import { records, requests } from '@application';
import {
  Conversation,
  TYPE_CONVERSATION,
  TYPE_USER,
  User,
} from '@chess-tent/models';

const activeUserConversations = records.createRecord(
  records.withRecordBase<Conversation[], { userId?: string }>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_CONVERSATION),
  records.withRecordApiLoad(requests.conversations),
  records.withRecordMethod('loadMore', () => () => record => async () => {
    const {
      value,
      meta: { userId },
    } = record.get();
    const skip = value?.length || 0;
    record.load(userId as string, { skip, limit: 5 });
  }),
);

const conversationParticipant = records.createRecord(
  records.withRecordBase<User, {}>(),
  records.withRecordDenormalized(TYPE_USER),
);

export { activeUserConversations, conversationParticipant };
