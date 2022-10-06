import { records, requests } from '@application';
import { TYPE_CONVERSATION, TYPE_USER } from '@chess-tent/models';
import {
  ActiveUserConversationsRecord,
  ConversationParticipantRecord,
} from '@types';
import { InferRecordEntry, MF } from '@chess-tent/redux-record/types';

const loadMore: MF<() => Promise<void>, ActiveUserConversationsRecord> =
  () => () => record => async () => {
    const limit = 10;
    const {
      value,
      meta: { userId, allLoaded },
    } = record.get() as InferRecordEntry<ActiveUserConversationsRecord>;
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
  };

const activeUserConversations =
  records.createRecord<ActiveUserConversationsRecord>({
    ...records.collectionRecipe,
    ...records.createDenormalizedCollectionRecipe(TYPE_CONVERSATION),
    ...records.createApiRecipe(requests.conversations),
    loadMore,
  });

const conversationParticipant =
  records.createRecord<ConversationParticipantRecord>(
    records.createDenormalizedRecipe(TYPE_USER),
  );

export { activeUserConversations, conversationParticipant };
