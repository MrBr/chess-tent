import { schema } from 'normalizr';
import { model } from '@application';
import { SCHEMA_EXERCISE } from '@chess-tent/models';

export const exerciseSchema = new schema.Entity(SCHEMA_EXERCISE, {
  section: model.sectionSchema,
  activeStep: model.stepSchema,
});
