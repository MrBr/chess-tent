import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';
import { Action } from 'redux';
import { normalize, Schema } from 'normalizr';
import {
  exerciseSchema,
  ExercisesState,
  sectionSchema,
  SectionsState,
  stepSchema,
  StepsState,
} from './types';
import {
  setExercisesAction,
  setSectionsAction,
  setStepsAction,
} from '../trainer/redux';

export const useDispatchBatched = () => {
  const dispatch = useDispatch();
  return useCallback((...args: Action[]) => dispatch(batchActions([...args])), [
    dispatch,
  ]);
};

export const useDispatchNormalizeBatched = () => {
  const dispatch = useDispatchBatched();
  return useCallback(
    (data: any, schema: Schema) => {
      const { entities } = normalize(data, schema);
      const batchedActions = Object.keys(entities).map(schemaKey => {
        if (schemaKey === exerciseSchema.key) {
          return setExercisesAction(entities[schemaKey] as ExercisesState);
        }
        if (schemaKey === sectionSchema.key) {
          return setSectionsAction(entities[schemaKey] as SectionsState);
        }
        if (schemaKey === stepSchema.key) {
          return setStepsAction(entities[schemaKey] as StepsState);
        }
        throw Error(`Unknow schema ${schemaKey}`);
      });
      dispatch(...batchedActions);
    },
    [dispatch],
  );
};
