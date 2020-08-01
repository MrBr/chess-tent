import { Lesson, Step } from '@chess-tent/models';
import { normalize } from 'normalizr';
import { utils } from '@application';
import { UpdateEntitiesAction, UPDATE_ENTITIES } from '@types';

export const updateEntitiesAction = (
  root: Lesson | Step,
): UpdateEntitiesAction => ({
  type: UPDATE_ENTITIES,
  payload: normalize(root, utils.getEntitySchema(root)).entities,
  meta: {},
});
