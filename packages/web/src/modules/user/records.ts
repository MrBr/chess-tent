import { records, requests } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';

const activeUser = records.createRecord(
  records.withRecordBase<User>(),
  records.withRecordDenormalized(TYPE_USER),
  records.withRecordApiLoad(requests.me),
  records.withRecordMethod()('save', () => () => record => async () => {
    const user = record.get().value;
    if (user) {
      record.amend({ loading: true });
      await requests.updateMe(user);
      record.amend({ loading: false });
    }
  }),
);

const user = records.createRecord(
  records.withRecordBase<User>(),
  records.withRecordDenormalized(TYPE_USER),
  records.withRecordApiLoad(requests.user),
);

export { activeUser, user };
