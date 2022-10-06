import { records, requests } from '@application';
import { Tag, TYPE_TAG } from '@chess-tent/models';
import { RecipeCollection, RecordBase } from '@chess-tent/redux-record/types';
import { RecipeApiLoad, RecipeDenormalizedCollection, Requests } from '@types';

const tags = records.createRecord<
  RecordBase<Tag[]> &
    RecipeApiLoad<Requests['tags']> &
    RecipeCollection<Tag> &
    RecipeDenormalizedCollection<Tag>
>({
  ...records.collectionRecipe,
  ...records.createApiRecipe(requests.tags),
  ...records.createDenormalizedCollectionRecipe(TYPE_TAG),
});

export { tags };
