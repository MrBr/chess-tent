import application from '@application';
import { Schema } from 'normalizr';
import { isLesson, isStep } from '@chess-tent/models';
import { model } from '@application';
import uuid from 'uuid/v1';

application.utils.getEntitySchema = (entity: unknown): Schema => {
  if (isStep(entity)) {
    return model.stepSchema;
  } else if (isLesson(entity)) {
    return model.lessonSchema;
  }
  throw Error(`Unknown entity: ${entity}.`);
};

application.utils.generateIndex = uuid;
application.utils.rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);
