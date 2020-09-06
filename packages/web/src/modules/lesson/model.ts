import { TYPE_LESSON, TYPE_STEP, TYPE_USER } from '@chess-tent/models';

export const lessonSchema = {
  type: TYPE_LESSON,
  relationships: {
    state: {
      steps: TYPE_STEP,
    },
    owner: TYPE_USER,
  },
};
