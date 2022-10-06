import { records } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';
import { RecipeCollection, RecordBase } from '@chess-tent/redux-record/types';
import { RecipeDenormalizedCollection } from '@types';

const roomUsers = records.createRecord<
  RecordBase<User[]> &
    RecipeCollection<User> &
    RecipeDenormalizedCollection<User>
>({
  ...records.collectionRecipe,
  ...records.createDenormalizedCollectionRecipe(TYPE_USER),
});

export { roomUsers };
