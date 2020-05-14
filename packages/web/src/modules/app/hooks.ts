import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';
import { Action } from 'redux';

export const useDispatchBatched = () => {
  const dispatch = useDispatch();
  return useCallback((...args: Action[]) => dispatch(batchActions([...args])), [
    dispatch,
  ]);
};
