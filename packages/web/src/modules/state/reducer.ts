import { Action as ReduxAction, combineReducers, Reducer } from 'redux';
import {
  Actions,
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

const createEntityReducer = <T extends keyof EntitiesState>(
  reducerEntityType: T,
) => (state: EntitiesState[T] = {}, action: Actions): EntitiesState[T] => {
  switch (action.type) {
    case UPDATE_ENTITIES: {
      return action.payload[reducerEntityType]
        ? {
            ...state,
            ...action.payload[reducerEntityType],
          }
        : state;
    }
    case UPDATE_ENTITY: {
      return action.payload.type === reducerEntityType
        ? {
            ...state,
            [utils.getEntityId(action.payload)]: action.payload,
          }
        : state;
    }
    case SEND_PATCH:
      const { next } = action.payload;
      const { type, id } = action.meta;
      const entity = state[id];
      return type === reducerEntityType && entity
        ? {
            ...state,
            [id]: applyPatches(entity, next),
          }
        : state;
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
  U extends ReduxAction
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
