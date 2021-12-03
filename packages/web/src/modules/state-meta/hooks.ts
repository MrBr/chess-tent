import { Hooks } from '@types';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMeta } from './state/selectors';
import { deleteMetaState, updateMetaState } from './state/actions';

// TODO - implement configurable initial meta
const initialMeta = Object.freeze({});

export const useMeta: Hooks['useMeta'] = <T>(
  metaKey: string,
  defaultValue?: T,
) => {
  const dispatch = useDispatch();
  const meta = useSelector(selectMeta(metaKey)) || defaultValue || initialMeta;

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
