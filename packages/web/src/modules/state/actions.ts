import { normalize } from 'normalizr';
import { utils } from '@application';
import { UPDATE_ENTITIES, State, EntitiesState } from '@types';

export const updateEntitiesAction: State['actions']['updateEntities'] = root => ({
  type: UPDATE_ENTITIES,
  payload: normalize(root, utils.getEntitySchema(root))
    .entities as EntitiesState,
  meta: {},
});
