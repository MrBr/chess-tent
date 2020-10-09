import { TYPE_LESSON, TYPE_TAG, TYPE_USER } from '@chess-tent/models';

export const lessonSchema = {
  type: TYPE_LESSON,
  relationships: {
    owner: TYPE_USER,
    tags: TYPE_TAG,
  },
};
