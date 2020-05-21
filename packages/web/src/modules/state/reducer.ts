import { combineReducers, Reducer } from 'redux';
import { Exercise, Section, Step } from '@chess-tent/models';
import { normalize } from 'normalizr';
import { getEntitySchema } from '../utils';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

export type EntityState<T> = { [key: string]: T };

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  meta: M;
};

export interface AppState {
  [key: string]: {};
  entities: { [key: string]: EntityState<any> };
}

export const appReducer: {
  [key: string]: Reducer;
} = {};

export const entityReducer: {
  [key: string]: Reducer;
} = {};

export const registerReducer = <T>(path: string, reducer: Reducer<T, any>) => {
  appReducer[path] = reducer;
  return path;
};

export const registerEntityReducer = <T>(
  path: string,
  reducer: Reducer<T, any>,
) => {
  entityReducer[path] = reducer;
};

export const getReducer = () => {
  return {
    ...appReducer,
    entities: combineReducers(entityReducer),
  };
};

export type UpdateEntitiesAction = Action<
  typeof UPDATE_ENTITIES,
  { [key: string]: any }
>;

export const updateEntitiesAction = (
  root: Exercise | Section | Step,
): UpdateEntitiesAction => ({
  type: UPDATE_ENTITIES,
  payload: normalize(root, getEntitySchema(root)).entities,
  meta: {},
});
