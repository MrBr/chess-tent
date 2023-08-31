import { TYPE_TAG, NormalizedTag, Tag } from '@chess-tent/models';
import { db } from '@application';

const tagSchema = db.createSchema<NormalizedTag>({
  type: {
    type: String,
    default: TYPE_TAG,
  } as unknown as typeof TYPE_TAG,
  text: {
    type: String,
    required: true,
    unique: true,
  } as unknown as NormalizedTag['text'],
});

const TagModel = db.createModel<NormalizedTag>(TYPE_TAG, tagSchema);

export const addTag = async (tag: Tag) => {
  await new TagModel(tag).save();
};

export { tagSchema, TagModel };
