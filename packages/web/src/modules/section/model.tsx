import { schema } from 'normalizr';

import { model } from '@application';

export const sectionSchema = new schema.Entity('sections');
export const sectionChildrenSchema = new schema.Array(
  {
    sections: sectionSchema,
    steps: model.stepSchema,
  },
  value => value.schema,
);
sectionSchema.define({ children: sectionChildrenSchema });
