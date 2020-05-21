import { schema } from 'normalizr';

import { stepSchema } from '../step';

export const sectionSchema = new schema.Entity('sections');
export const sectionChildrenSchema = new schema.Array(
  {
    sections: sectionSchema,
    steps: stepSchema,
  },
  value => value.schema,
);
sectionSchema.define({ children: sectionChildrenSchema });
