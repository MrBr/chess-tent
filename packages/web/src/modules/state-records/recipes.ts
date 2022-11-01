import { utils } from '@application';
import { Records } from '@types';
import { MF, RecordBase, RecordEntry } from '@chess-tent/redux-record/types';
import { Entity } from '@chess-tent/models';
import { selectRecord, removeRecordAction } from '@chess-tent/redux-record';

const remove: MF<(entity: Entity, meta?: {}) => void> =
  recordKey => store => () => (entity, meta) => {
    store.dispatch(
      removeRecordAction(recordKey, utils.getEntityId(entity), meta),
    );
  };

const createDenormalizedRecipe: Records['createDenormalizedRecipe'] = <
  T extends Entity,
>(
  type: string,
) => {
  const get: MF<() => RecordEntry<T, any>> = recordKey => store => () => () => {
    const appState = store.getState();
    const recordEntry =
      selectRecord<RecordBase<string, any>>(recordKey)(appState);
    const entities = appState.entities;
    const value = recordEntry?.value
      ? utils.denormalize(recordEntry.value, type, entities)
      : undefined;
    return { ...recordEntry, value } as RecordEntry<T, any>;
  };

  const initialMeta = {
    normalized: true as true,
  };

  return {
    get,
    initialMeta,
    remove,
  };
};

const createDenormalizedCollectionRecipe: Records['createDenormalizedCollectionRecipe'] =
  <T extends Entity[]>(type: string) => {
    const get: MF<() => RecordEntry<T[], any>> =
      recordKey => store => () => () => {
        const appState = store.getState();
        const recordEntry =
          selectRecord<RecordBase<string[], any>>(recordKey)(appState);
        const entities = appState.entities;
        const value = recordEntry?.value
          ?.map(id => utils.denormalize(id, type, entities))
          // TODO - handle better case when the entity has been deleted
          .filter(Boolean);
        return { ...recordEntry, value } as RecordEntry<T[], any>;
      };

    const initialMeta = {
      normalized: true as true,
    };

    return {
      get,
      initialMeta,
      remove,
    };
  };

export { createDenormalizedCollectionRecipe, createDenormalizedRecipe };
