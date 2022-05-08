import { Action as ReduxAction, combineReducers, Reducer } from 'redux';
import {
  Actions,
  DELETE_ENTITY,
  EntitiesState,
  SEND_PATCH,
  UPDATE_ENTITIES,
  UPDATE_ENTITY,
} from '@chess-tent/types';
import { applyPatches } from '@chess-tent/models';
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
        // TODO - standardise "patching"
        // update entity has a dual behavior
        // it ONLY sometimes sends a patch which should be applied
        // in other cases, it sends a whole object
        // sending a whole object can leads to the race when the same entity is updated multiple times immediately one after the other
        // basically first update doesn't have to be taken into an account for the second, meaning, the next update used stale state in update which in the end overrides previous action
        const updatedEntity =
          // patch can exist but there may be no change
          reducerEntityType === type && patch?.next?.length && entity
            ? utils.normalize(applyPatches(entity, patch.next)).result
            : (action.payload.entities[type][id] as unknown);
        return isEmpty(action.payload.entities[reducerEntityType])
          ? state
          : {
              ...state,
              // TODO - is this valid - to update related entities (produced by normalization)
              ...action.payload.entities[reducerEntityType],
              [id]: updatedEntity,
            };
      }
      case SEND_PATCH: {
        const { next } = action.payload;
        const { type, id } = action.meta;
        const entity = state[id];
        return type === reducerEntityType && entity
          ? {
              ...state,
              [id]: applyPatches(entity, next),
            }
          : state;
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
  return combineReducers({
    ...appReducer,
    entities: combineReducers(entityReducer),
  });
};
