import {
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

export type EntityState<T> = { [key: string]: T };

export interface AppState {
  activeUser: ActiveUserState;
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
export type LessonState = { [key: string]: NormalizedLesson };

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

/**
 * User
 */
export type UserState = { [key: string]: NormalizedUser };

export type UpdateUserAction = Action<
  typeof UPDATE_USER,
  Partial<User>,
  { id: User['id'] }
>;

export type UserAction = UpdateEntitiesAction | UpdateUserAction;

/**
 * Active User
 */
export type ActiveUserState = User['id'] | null;

export type UserLoggedInAction = Action<typeof USER_LOGGED_IN, User>;

export type UserLoggedOutAction = Action<typeof USER_LOGGED_OUT, {}>;

export type ActiveUserAction = UserLoggedInAction | UserLoggedOutAction;
