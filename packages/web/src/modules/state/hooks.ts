import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';
import { ServiceType } from '@chess-tent/models';
import { serviceAction } from './actions';

export const useDispatchBatched = () => {
  const dispatch = useDispatch();
  return useCallback((...args: Action[]) => dispatch(batchActions([...args])), [
    dispatch,
  ]);
};

export const useDispatchService = () => {
  const dispatch = useDispatch();

  return useCallback(
    <T extends (...args: any) => any>(
      service: T extends ServiceType ? T : never,
    ) => (...args: T extends (...args: infer U) => any ? U : never) => {
      dispatch(serviceAction(service)(...args));
    },
    [dispatch],
  );
};
