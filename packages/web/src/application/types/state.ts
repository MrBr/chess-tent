import {
  Exercise,
  NormalizedExercise,
  NormalizedSection,
  NormalizedStep,
  Section,
  Step,
} from '@chess-tent/models';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

export const SET_EXERCISE_ACTIVE_STEP = 'SET_EXERCISE_ACTIVE_STEP';
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE';

export const ADD_SECTION_CHILD = 'ADD_SECTION_CHILD';
export const REMOVE_SECTION_CHILD = 'REMOVE_SECTION_CHILD';

export const UPDATE_STEP = 'UPDATE_STEP';
export const UPDATE_STEP_STATE = 'UPDATE_STEP_STATE';

export type EntityState<T> = { [key: string]: T };

export interface AppState {
  [key: string]: {};
  entities: { [key: string]: EntityState<any> };
}

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  meta: M;
};

export type UpdateEntitiesAction = Action<
  typeof UPDATE_ENTITIES,
  { [key: string]: any }
>;

/**
 * Exercise
 */
export type ExercisesState = { [key: string]: NormalizedExercise };

export type SetExerciseActiveStepAction = Action<
  typeof SET_EXERCISE_ACTIVE_STEP,
  Step['id'],
  { id: Exercise['id'] }
>;
export type UpdateExerciseAction = Action<
  typeof UPDATE_EXERCISE,
  Omit<NormalizedExercise, 'type' | 'id'>,
  { id: Exercise['id'] }
>;

export type ExerciseAction =
  | UpdateEntitiesAction
  | SetExerciseActiveStepAction
  | UpdateExerciseAction;

/**
 * Section
 */
export type SectionsState = { [key: string]: NormalizedSection };

export type AddSectionChildAction = Action<
  typeof ADD_SECTION_CHILD,
  | { id: Section['id']; type: Section['type'] }
  | { id: Step['id']; type: Step['type'] },
  { id: Section['id'] }
>;
export type RemoveSectionChildAction = Action<
  typeof REMOVE_SECTION_CHILD,
  | { id: Section['id']; type: Section['type'] }
  | { id: Step['id']; type: Step['type'] },
  { id: Section['id'] }
>;

export type SectionAction =
  | UpdateEntitiesAction
  | AddSectionChildAction
  | RemoveSectionChildAction;

/**
 * Step
 */
export type StepsState = { [key: string]: NormalizedStep };

export type UpdatableStepProps = Omit<{}, 'moves' | 'type' | 'shapes' | 'id'>;
export type UpdateStepAction = Action<
  typeof UPDATE_STEP,
  UpdatableStepProps,
  { id: Step['id'] }
>;
export type UpdateStepStateAction = Action<
  typeof UPDATE_STEP_STATE,
  {},
  { id: Step['id'] }
>;

export type StepAction =
  | UpdateEntitiesAction
  | UpdateStepAction
  | UpdateStepStateAction;
