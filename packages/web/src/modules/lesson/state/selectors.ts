import { Lesson, TYPE_LESSON } from '@chess-tent/models';
import { AppState } from '@types';
import { utils } from '@application';

export const lessonSelector =
  (lessonId: Lesson['id']) =>
  (state: AppState): Lesson | null =>
    utils.denormalize(lessonId, TYPE_LESSON, state.entities);
