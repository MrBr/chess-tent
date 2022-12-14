import { utils } from '@application';
import {
  EntitiesState,
  State,
  UPDATE_ENTITIES,
  UPDATE_ENTITY,
  SEND_PATCH,
  SendPatchAction,
  RESET_STATE,
} from '@types';
import {
  createReversiblePatch,
  Entity,
  ReversiblePatch,
  ServiceType,
  Patch,
} from '@chess-tent/models';
import { DELETE_ENTITY } from '@chess-tent/types';
import { normalizePatches } from './service';

export const resetStateAction: State['actions']['resetState'] = () => ({
  type: RESET_STATE,
  payload: undefined,
  meta: {},
});

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
  (...args: T extends (...args: infer U) => any ? U : never) => {
    const meta: { patch?: ReversiblePatch } = {};
    let argsWithOptionalParams = args;
    // Patch listener is injected as the last argument
    // If there are optional params before Patch listener they'll be overridden by it
    // This function sets optional params to undefined
    // -1 makes room for Patch listener
    if (args.length < service.length - 1) {
      argsWithOptionalParams = args.concat(
        Array.from({ length: service.length - 1 - args.length }),
      );
    }

    const updatedEntity = service(
      ...argsWithOptionalParams,
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
): SendPatchAction => {
  const { result: patch, entities } = normalizePatches(
    reversiblePatch.next,
    type,
  );

  return {
    type: SEND_PATCH,
    payload: { patch, entities },
    meta: {
      id,
      type,
    },
  };
};
