import { utils } from '@application';
import { UPDATE_ENTITIES, State, EntitiesState } from '@types';

export const updateEntitiesAction: State['actions']['updateEntities'] = root => {
  const payload = (Array.isArray(root) ? root : [root]).reduce<
    Partial<EntitiesState>
  >((result, entity) => {
    const entities = utils.normalize(entity).entities as EntitiesState;
    Object.keys(entities).forEach(type => {
      // @ts-ignore
      result[type] = {
        ...result[type as keyof EntitiesState],
        ...entities[type as keyof EntitiesState],
      };
    });
    return result;
  }, {}) as EntitiesState;

  return {
    type: UPDATE_ENTITIES,
    payload,
    meta: {},
  };
};
