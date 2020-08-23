import {
  Entity,
  Lesson,
  NormalizedLesson,
  NormalizedStep,
  NormalizedUser,
  Step,
  User,
} from '@chess-tent/models';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

export const SET_LESSON_ACTIVE_STEP = 'SET_LESSON_ACTIVE_STEP';
export const UPDATE_LESSON = 'UPDATE_LESSON';

export const UPDATE_STEP = 'UPDATE_STEP';
export const UPDATE_STEP_STATE = 'UPDATE_STEP_STATE';

export const UPDATE_USER = 'UPDATE_USER';
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const RECORD_UPDATE_ACTION = 'RECORD_UPDATE_ACTION';
export const RECORD_DELETE_ACTION = 'RECORD_DELETE_ACTION';

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  meta: M;
};
export type EntityState<T> = { [key: string]: T };
export type EntitiesState = {
  users: UserState;
  lessons: LessonState;
  steps: StepsState;
};
/**
 * Records are used to store single entity reference
 * or a collection which have domain meaning.
 * Records represent complex data model which holds
 * both data and metadata about the record.
 */
export type RecordValue = Entity | Entity[];
export type RecordMeta = { type?: string };
export type RecordType = {
  value: string | string[];
  meta: RecordMeta;
};
export type RecordState = Record<string, RecordType>;
export type LessonState = EntityState<NormalizedLesson>;
export type StepsState = EntityState<NormalizedStep>;
export type UserState = EntityState<NormalizedUser>;

export interface AppState {
  entities: EntitiesState;
  records: RecordState;
}

export type UpdateEntitiesAction = Action<
  typeof UPDATE_ENTITIES,
  EntitiesState
>;

/**
 * Exercise
 */

export type SetLessonActiveStepAction = Action<
  typeof SET_LESSON_ACTIVE_STEP,
  Step['id'],
  { id: Lesson['id'] }
>;
export type UpdateLessonAction = Action<
  typeof UPDATE_LESSON,
  Omit<NormalizedLesson, 'type' | 'id'>,
  { id: Lesson['id'] }
>;

export type LessonAction =
  | UpdateEntitiesAction
  | SetLessonActiveStepAction
  | UpdateLessonAction;

/**
 * Step
 */

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

/**
 * User
 */

export type UpdateUserAction = Action<
  typeof UPDATE_USER,
  Partial<User>,
  { id: User['id'] }
>;

export type UserAction = UpdateEntitiesAction | UpdateUserAction;

/**
 * Records
 */
export type RecordUpdateAction = Action<
  typeof RECORD_UPDATE_ACTION,
  { value: RecordValue; meta: RecordMeta },
  { key: string }
>;

export type RecordDeleteAction = Action<
  typeof RECORD_DELETE_ACTION,
  void,
  { key: string }
>;

export type RecordAction = RecordUpdateAction | RecordDeleteAction;
