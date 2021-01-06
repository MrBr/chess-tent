import { Hooks } from '@types';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMeta } from './state/selectors';
import { deleteMetaState, updateMetaState } from './state/actions';

export const useMeta: Hooks['useMeta'] = <T>(metaKey: string) => {
  const dispatch = useDispatch();
  const meta = useSelector(selectMeta(metaKey));

  const update = useCallback(
    (value: T) => {
      dispatch(updateMetaState(metaKey, value));
    },
    [metaKey, dispatch],
  );

  const remove = useCallback(() => {
    dispatch(deleteMetaState(metaKey));
  }, [metaKey, dispatch]);

  return useMemo(() => [meta, update, remove], [meta, update, remove]);
};
