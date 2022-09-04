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
  records.withRecordMethod<{ allLoaded: boolean }>()(
    'loadMore',
    () => () => record => async () => {
      const limit = 10;
      const {
        value,
        meta: { userId, allLoaded },
      } = record.get();
      if (allLoaded) {
        return;
      }
      const skip = value?.length || 0;
      record.amend({ loading: true });
      const response = await requests.conversations(userId as string, {
        skip,
        limit,
      });
      record.concat(response.data, {
        allLoaded: response.data.length < limit,
        loading: false,
      });
    },
  ),
);

const conversationParticipant = records.createRecord(
  records.withRecordBase<User, {}>(),
  records.withRecordDenormalized(TYPE_USER),
);

export { activeUserConversations, conversationParticipant };
