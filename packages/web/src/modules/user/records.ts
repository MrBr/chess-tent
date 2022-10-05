import { records, requests } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';
import {
  ActiveUserRecord,
  RecipeApiLoad,
  RecipeDenormalized,
  Requests,
} from '@types';
import { MF, RecordBase } from '@chess-tent/redux-record/types';

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

const user = records.createRecord<
  RecordBase<User> & RecipeApiLoad<Requests['user']> & RecipeDenormalized<User>
>({
  ...records.createDenormalizedRecipe(TYPE_USER),
  ...records.createApiRecipe(requests.user),
});

export { activeUser, user };
