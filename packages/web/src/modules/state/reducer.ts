import { Action as ReduxAction, combineReducers, Reducer } from 'redux';
import {
  Actions,
  AppState,
  DELETE_ENTITY,
  EntitiesState,
  RESET_STATE,
  SEND_PATCH,
  UPDATE_ENTITIES,
  UPDATE_ENTITY,
} from '@chess-tent/types';
import { applyPatches, validatePatches } from '@chess-tent/models';
import { utils } from '@application';

const appReducer: {
  [key: string]: Reducer;
} = {};

const entityReducer: {
  [key: string]: Reducer;
} = {};

const isEmpty = (obj: {}) => {
  for (const i in obj) return false;
  return true;
};

const createEntityReducer =
  <T extends keyof EntitiesState>(reducerEntityType: T) =>
  (state: EntitiesState[T] = {}, action: Actions): EntitiesState[T] => {
    switch (action.type) {
      case UPDATE_ENTITIES: {
        return isEmpty(action.payload[reducerEntityType])
          ? state
          : {
              ...state,
              ...action.payload[reducerEntityType],
            };
      }
      case UPDATE_ENTITY: {
        const { patch, type, id } = action.meta;
        const entity = state[id];

        // This automatically takes care of a none patch actions
        // takes [type][id] entity from the updates
        const updatedEntities = {
          ...action.payload.entities[reducerEntityType],
        } as Record<string, EntitiesState[T]>;
        // TODO - standardise "patching"
        // update entity has a dual behavior
        // it ONLY sometimes sends a patch which should be applied
        // in other cases, it sends a whole object
        // sending a whole object can leads to the race when the same entity is updated multiple times immediately one after the other
        // basically first update doesn't have to be taken into an account for the second, meaning, the next update used stale state in update which in the end overrides previous action
        if (!!patch?.next?.length && reducerEntityType === type && entity) {
          // patch action
          updatedEntities[id] = utils.normalize(
            applyPatches(entity, patch.next),
          ).result;
        } else if (!!patch?.next?.length && patch?.next?.length === 0) {
          // Patch action with no update, don't change the entity
          delete updatedEntities[id];
        }

        return isEmpty(updatedEntities)
          ? state
          : {
              ...state,
              // TODO - is this valid - to update related entities (produced by normalization)
              ...updatedEntities,
            };
      }
      case SEND_PATCH: {
        const { patch, entities } = action.payload;
        const { type, id } = action.meta;
        const entity = state[id];
        const updatedEntities: Record<string, any> = {
          ...(entities[reducerEntityType] || {}),
        };
        if (type === reducerEntityType && entity) {
          if (!validatePatches(entity, patch)) {
            throw new Error('Corrupted state!');
          }
          // Patch action is NORMALIZED
          const updatedEntity = applyPatches(entity, patch);
          updatedEntities[id] = updatedEntity;
        }

        if (isEmpty(updatedEntities)) {
          return state;
        }

        return {
          ...state,
          ...updatedEntities,
        };
      }
      case DELETE_ENTITY: {
        const { type, id } = action.meta;
        if (type === reducerEntityType) {
          const newState = { ...state };
          delete newState[id];
          return newState;
        }
        return state;
      }
      default: {
        return state;
      }
    }
  };

export const registerReducer = <T>(path: string, reducer: Reducer<T, any>) => {
  appReducer[path] = reducer;
};

export const registerEntityReducer = <
  T extends keyof EntitiesState,
  S,
  U extends ReduxAction,
>(
  type: T,
  customReducer: Reducer<S, U> = state => state as S,
) => {
  const reducer = createEntityReducer(type);
  entityReducer[type] = (state, action) => {
    const customReducerState = customReducer(state, action as U);
    return customReducerState === state || !customReducerState
      ? reducer(state, action as Actions)
      : customReducerState;
  };
};

export const getRootReducer = () => {
  const rootReducer = combineReducers({
    ...appReducer,
    entities: combineReducers(entityReducer),
  });

  return ((state, action) => {
    if (action.type === RESET_STATE) {
      return rootReducer(undefined, action);
    }
    return rootReducer(state, action);
  }) as Reducer<AppState, Actions>;
};
