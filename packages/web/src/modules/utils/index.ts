import application from '@application';
import { Schema } from 'normalizr';
import { isExercise, isSection, isStep } from '@chess-tent/models';
import { model } from '@application';

application.register(
  () => [model.stepSchema, model.sectionSchema, model.exerciseSchema],
  () => {
    application.utils.getEntitySchema = (entity: unknown): Schema => {
      if (isStep(entity)) {
        return model.stepSchema;
      } else if (isSection(entity)) {
        return model.sectionSchema;
      } else if (isExercise(entity)) {
        return model.exerciseSchema;
      }
      throw Error(`Unknown entity: ${entity}.`);
    };
  },
);

application.register(() => {
  application.utils.rightMouse = (f: Function) => (e: MouseEvent) =>
    e.button === 2 && f(e);
});
