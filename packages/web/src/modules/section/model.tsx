import { schema } from 'normalizr';

import { model } from '@application';
import { SectionChild, TYPE_SECTION } from '@chess-tent/models';

export const sectionSchema = new schema.Entity(TYPE_SECTION);
export const sectionChildrenSchema = new schema.Array(
  {
    sections: sectionSchema,
    steps: model.stepSchema,
  },
  (value: SectionChild) => value.type,
);
sectionSchema.define({ children: sectionChildrenSchema });
