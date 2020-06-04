import { denormalize } from 'normalizr';
import { Lesson } from '@chess-tent/models';
import { AppState } from '@types';
import { model } from '@application';

export const lessonSelector = (lessonId: Lesson['id']) => (
  state: AppState,
): Lesson => denormalize(lessonId, model.lessonSchema, state.entities);
