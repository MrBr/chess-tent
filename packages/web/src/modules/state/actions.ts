import { normalize } from 'normalizr';
import { utils } from '@application';
import { UPDATE_ENTITIES, State, EntitiesState } from '@types';
import { merge } from 'lodash';

export const updateEntitiesAction: State['actions']['updateEntities'] = root => {
  const payload = (Array.isArray(root) ? root : [root]).reduce(
    (result, entity) => {
      const entities = normalize(entity, utils.getEntitySchema(entity))
        .entities as EntitiesState;
      return merge(result, entities);
    },
    {},
  ) as EntitiesState;

  return {
    type: UPDATE_ENTITIES,
    payload,
    meta: {},
  };
};
