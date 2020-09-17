import { TYPE_LESSON, TYPE_USER } from '@chess-tent/models';

export const lessonSchema = {
  type: TYPE_LESSON,
  relationships: {
    owner: TYPE_USER,
  },
};
