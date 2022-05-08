import { utils } from '@application';
import {
  EntitiesState,
  State,
  UPDATE_ENTITIES,
  UPDATE_ENTITY,
  SEND_PATCH,
  SendPatchAction,
} from '@types';
import {
  createReversiblePatch,
  Entity,
  ReversiblePatch,
  ServiceType,
  Patch,
} from '@chess-tent/models';
import { DELETE_ENTITY } from '@chess-tent/types';

export const updateEntitiesAction: State['actions']['updateEntities'] =
  root => {
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

export const updateEntityAction: State['actions']['updateEntity'] = (
  entity,
  meta?,
) => {
  const payload = utils.normalize(entity);

  return {
    type: UPDATE_ENTITY,
    payload,
    meta: {
      id: utils.getEntityId(payload.result),
      type: payload.result.type,
      ...(meta || {}),
    },
  };
};
export const deleteEntityAction: State['actions']['deleteEntity'] = entity => {
  const payload = utils.normalize(entity);

  return {
    type: DELETE_ENTITY,
    payload: undefined,
    meta: {
      id: utils.getEntityId(payload.result),
      type: payload.result.type,
    },
  };
};

export const serviceAction =
  <T extends (...args: any) => any>(
    service: T extends ServiceType ? T : never,
  ) =>
  (...payload: T extends (...args: infer U) => any ? U : never) => {
    const meta: { patch?: ReversiblePatch } = {};
    const updatedEntity = service(
      ...payload,
      (next: Patch[], prev: Patch[]) => {
        meta.patch = createReversiblePatch(next, prev);
      },
    ) as Entity;
    return updateEntityAction(updatedEntity, meta);
  };

export const sendPatchAction = (
  reversiblePatch: ReversiblePatch,
  id: string,
  type: string,
): SendPatchAction => ({
  type: SEND_PATCH,
  payload: reversiblePatch,
  meta: {
    id,
    type,
  },
});
