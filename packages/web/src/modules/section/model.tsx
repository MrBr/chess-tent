import { schema } from 'normalizr';

import { model } from '@application';
import { SectionChild } from '@chess-tent/models';

export const sectionSchema = new schema.Entity('sections');
export const sectionChildrenSchema = new schema.Array(
  {
    sections: sectionSchema,
    steps: model.stepSchema,
  },
  (value: SectionChild) => value.type,
);
sectionSchema.define({ children: sectionChildrenSchema });
