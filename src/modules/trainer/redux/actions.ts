import { normalize } from 'normalizr';
import { Action, Exercise, Section, StepInstance } from '../../app/types';
import { getEntitySchema } from '../service';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

export const SET_EXERCISE_ACTIVE_STEP = 'SET_EXERCISE_ACTIVE_STEP';
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE';

export const ADD_SECTION_CHILD = 'ADD_SECTION_CHILD';
export const REMOVE_SECTION_CHILD = 'REMOVE_SECTION_CHILD';

export const UPDATE_STEP = 'UPDATE_STEP';
export const UPDATE_STEP_STATE = 'UPDATE_STEP_STATE';

type UpdateEntitiesAction = Action<
  typeof UPDATE_ENTITIES,
  {
    exercises?: Exercise[];
    sections?: Section[];
    steps?: StepInstance[];
  }
>;

export const updateEntitiesAction = (
  root: Exercise | Section | StepInstance,
): UpdateEntitiesAction => ({
  type: UPDATE_ENTITIES,
  payload: normalize(root, getEntitySchema(root)).entities,
  meta: {},
});

/**
 * Exercise actions
 */
type SetExerciseActiveStepAction = Action<
  typeof SET_EXERCISE_ACTIVE_STEP,
  StepInstance['id'],
  { id: Exercise['id'] }
>;
type UpdateExerciseAction = Action<
  typeof UPDATE_EXERCISE,
  Omit<Exercise, 'schema' | 'id'>,
  { id: Exercise['id'] }
>;

export type ExerciseAction =
  | UpdateEntitiesAction
  | SetExerciseActiveStepAction
  | UpdateExerciseAction;

export const setExerciseActiveStepAction = (
  exercise: Exercise,
  step: StepInstance,
): SetExerciseActiveStepAction => ({
  type: SET_EXERCISE_ACTIVE_STEP,
  payload: step.id,
  meta: {
    id: exercise.id,
  },
});

/**
 * Section actions
 */
type AddSectionChildAction = Action<
  typeof ADD_SECTION_CHILD,
  | { id: Section['id']; schema: Section['schema'] }
  | { id: StepInstance['id']; schema: StepInstance['schema'] },
  { id: Section['id'] }
>;
type RemoveSectionChildAction = Action<
  typeof REMOVE_SECTION_CHILD,
  | { id: Section['id']; schema: Section['schema'] }
  | { id: StepInstance['id']; schema: StepInstance['schema'] },
  { id: Section['id'] }
>;

export type SectionAction =
  | UpdateEntitiesAction
  | AddSectionChildAction
  | RemoveSectionChildAction;

export const addSectionChildAction = (
  section: Section,
  childSection: Section | StepInstance,
): AddSectionChildAction => ({
  type: ADD_SECTION_CHILD,
  payload: {
    id: childSection.id,
    schema: childSection.schema,
  },
  meta: {
    id: section.id,
  },
});
export const removeSectionChildAction = (
  section: Section,
  child: Section | StepInstance,
): RemoveSectionChildAction => ({
  type: REMOVE_SECTION_CHILD,
  payload: {
    id: child.id,
    schema: child.schema,
  },
  meta: {
    id: section.id,
  },
});
/**
 * Step actions
 */
type UpdatableStepProps = Omit<{}, 'moves' | 'schema' | 'shapes' | 'id'>;
type UpdateStepAction = Action<
  typeof UPDATE_STEP,
  UpdatableStepProps,
  { id: StepInstance['id'] }
>;
type UpdateStepStateAction = Action<
  typeof UPDATE_STEP_STATE,
  {},
  { id: StepInstance['id'] }
>;

export type StepAction =
  | UpdateEntitiesAction
  | UpdateStepAction
  | UpdateStepStateAction;

export const updateStepAction = (
  step: StepInstance,
  patch: UpdatableStepProps,
): UpdateStepAction => ({
  type: UPDATE_STEP,
  payload: patch,
  meta: {
    id: step.id,
  },
});
export const updateStepStateAction = (
  step: StepInstance,
  statePatch: {},
): UpdateStepStateAction => ({
  type: UPDATE_STEP_STATE,
  payload: statePatch,
  meta: {
    id: step.id,
  },
});
