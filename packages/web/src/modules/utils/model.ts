import {
  isActivity,
  isLesson,
  isStep,
  isUser,
  TYPE_ACTIVITY,
  TYPE_LESSON,
  TYPE_STEP,
  TYPE_USER,
} from '@chess-tent/models';
import { model } from '@application';
import { Schema } from '@types';

export const getEntitySchema = (entity: unknown): Schema => {
  if (isStep(entity)) {
    return model.stepSchema;
  } else if (isLesson(entity)) {
    return model.lessonSchema;
  } else if (isUser(entity)) {
    return model.userSchema;
  } else if (isActivity(entity)) {
    return model.activitySchema;
  }
  throw Error(`Unknown entity: ${entity}.`);
};

export const getTypeSchema = (type: string): Schema => {
  if (type === TYPE_STEP) {
    return model.stepSchema;
  } else if (type === TYPE_LESSON) {
    return model.lessonSchema;
  } else if (type === TYPE_USER) {
    return model.userSchema;
  } else if (type === TYPE_ACTIVITY) {
    return model.activitySchema;
  }
  throw Error(`Unknown type: ${type}.`);
};
