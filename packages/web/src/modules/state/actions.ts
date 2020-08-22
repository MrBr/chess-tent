import { Lesson, Step, User } from '@chess-tent/models';
import { normalize } from 'normalizr';
import { utils } from '@application';
import { UpdateEntitiesAction, UPDATE_ENTITIES, State } from '@types';

export const updateEntitiesAction: State['actions']['updateEntities'] = root => ({
  type: UPDATE_ENTITIES,
  payload: normalize(root, utils.getEntitySchema(root)).entities,
  meta: {},
});
