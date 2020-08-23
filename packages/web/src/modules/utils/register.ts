import application from '@application';
import { Schema } from 'normalizr';
import { isLesson, isStep, isUser } from '@chess-tent/models';
import { model } from '@application';
import { v4 as uuid } from 'uuid';
import { useComponentStateSilent } from './hooks';

application.utils.getEntitySchema = (entity: unknown): Schema => {
  if (isStep(entity)) {
    return model.stepSchema;
  } else if (isLesson(entity)) {
    return model.lessonSchema;
  } else if (isUser(entity)) {
    return model.userSchema;
  }
  throw Error(`Unknown entity: ${entity}.`);
};

application.utils.generateIndex = uuid;
application.utils.rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);

application.hooks.useComponentStateSilent = useComponentStateSilent;
