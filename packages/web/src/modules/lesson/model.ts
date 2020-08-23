import { schema } from 'normalizr';
import { model } from '@application';
import { TYPE_LESSON } from '@chess-tent/models';

export const lessonSchema = new schema.Entity(TYPE_LESSON, {
  owner: model.userSchema,
  state: {
    steps: [model.stepSchema],
    activeStep: model.stepSchema,
  },
});
