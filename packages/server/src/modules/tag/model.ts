import { model, Document } from "mongoose";
import { TYPE_TAG, NormalizedTag } from "@chess-tent/models";
import { db } from "@application";

const tagSchema = db.createStandardSchema<NormalizedTag>({
  type: ({
    type: String,
    default: TYPE_TAG
  } as unknown) as typeof TYPE_TAG,
  text: ({
    type: String,
    required: true,
    unique: true
  } as unknown) as NormalizedTag["text"]
});

const TagModel = model<NormalizedTag & Document>(TYPE_TAG, tagSchema);

export { tagSchema, TagModel };
