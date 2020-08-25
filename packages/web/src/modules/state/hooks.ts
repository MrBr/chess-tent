import { Action } from 'redux';
import { AppState, RecordValue } from '@types';
import { utils } from '@application';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';

export const useDispatchBatched = () => {
  const dispatch = useDispatch();
  return useCallback((...args: Action[]) => dispatch(batchActions([...args])), [
    dispatch,
  ]);
};

const useState = () => useSelector(state => state);
export const useDenormalize = <T extends RecordValue>(
  descriptor: string[] | string | null,
  type?: string,
) => {
  const state = useState() as AppState;
  if (!descriptor || !type) {
    return null;
  }
  // TODO - optimimze denormalize collection
  let denormalized;
  if (Array.isArray(descriptor)) {
    denormalized = [];
    for (let i = 0; i < descriptor.length; i++) {
      denormalized.push(utils.denormalize(descriptor[i], type, state.entities));
    }
  } else {
    denormalized = utils.denormalize(descriptor, type, state.entities);
  }
  return denormalized as T;
};
