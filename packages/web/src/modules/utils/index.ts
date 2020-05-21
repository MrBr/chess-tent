import { Schema } from 'normalizr';
import { isExercise, isSection, isStep } from '@chess-tent/models';
import { stepSchema } from '../step';
import { sectionSchema } from '../section';
import { exerciseSchema } from '../exercise';

// Utils
const getEntitySchema = (entity: unknown): Schema => {
  if (isStep(entity)) {
    return stepSchema;
  } else if (isSection(entity)) {
    return sectionSchema;
  } else if (isExercise(entity)) {
    return exerciseSchema;
  }
  throw Error(`Unknown entity: ${entity}.`);
};

export const rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);

export { getEntitySchema };
