import application from '@application';
import { Schema } from 'normalizr';
import { isLesson, isSection, isStep } from '@chess-tent/models';
import { model } from '@application';

application.utils.getEntitySchema = (entity: unknown): Schema => {
  if (isStep(entity)) {
    return model.stepSchema;
  } else if (isSection(entity)) {
    return model.sectionSchema;
  } else if (isLesson(entity)) {
    return model.lessonSchema;
  }
  throw Error(`Unknown entity: ${entity}.`);
};

application.utils.rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);
