import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';

export const useDispatchBatched = () => {
  const dispatch = useDispatch();
  return useCallback((...args: Action[]) => dispatch(batchActions([...args])), [
    dispatch,
  ]);
};
