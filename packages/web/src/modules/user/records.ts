import { records, requests, state } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';
import {
  ActiveUserRecord,
  RecipeApiLoad,
  RecipeDenormalized,
  Requests,
} from '@types';
import { MF, RecordBase } from '@chess-tent/redux-record/types';

const {
  selectors: { selectNormalizedEntities },
} = state;

const saveUser: MF<() => Promise<void>, ActiveUserRecord> =
  () => () => record => async () => {
    const user = record.get()?.value;
    if (user) {
      record.amend({ loading: true });
      await requests.updateMe(user);
      record.amend({ loading: false });
    }
  };
const activeUser = records.createRecord<ActiveUserRecord>({
  ...records.collectionRecipe,
  ...records.createApiRecipe(requests.me),
  ...records.createDenormalizedRecipe(TYPE_USER),
  save: saveUser,
});

const load: MF<(userId: string) => Promise<void>> =
  () => store => record => async userId => {
    const normalizedUser = selectNormalizedEntities(
      userId,
      TYPE_USER,
    )(store.getState());
    if (normalizedUser) {
      record.update(normalizedUser);
    } else {
      record.amend({ loading: true });
      const { data: user } = await requests.user(userId);
      record.update(user, { loading: false });
    }
  };
const user = records.createRecord<
  RecordBase<User> &
    RecipeApiLoad<Requests['user']> &
    RecipeDenormalized<User> & { load: MF<(userId: string) => Promise<void>> }
>({
  ...records.createDenormalizedRecipe(TYPE_USER),
  ...records.createApiRecipe(requests.user),
  load: load,
});

export { activeUser, user };
