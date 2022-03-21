import { Action } from '@chess-tent/types';

export const UPDATE_META_STATE = 'UPDATE_META_STATE';
export const DELETE_META_STATE = 'DELETE_META_STATE';

export type UpdateMetaStateAction = Action<
  typeof UPDATE_META_STATE,
  any,
  { key: string }
>;

export type DeleteMetaStateAction = Action<
  typeof DELETE_META_STATE,
  undefined,
  { key: string }
>;

export const updateMetaState = <T>(
  key: string,
  payload: T,
): UpdateMetaStateAction => ({
  type: UPDATE_META_STATE,
  payload,
  meta: {
    key,
  },
});

export const deleteMetaState = (key: string): DeleteMetaStateAction => ({
  type: DELETE_META_STATE,
  payload: undefined,
  meta: {
    key,
  },
});
