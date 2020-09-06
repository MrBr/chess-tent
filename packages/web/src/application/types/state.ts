import {
  Activity,
  Entity,
  Lesson,
  NormalizedActivity,
  NormalizedConversation,
  NormalizedLesson,
  NormalizedStep,
  NormalizedUser,
  Step,
  Subject,
  User,
} from '@chess-tent/models';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

export const SET_LESSON_ACTIVE_STEP = 'SET_LESSON_ACTIVE_STEP';
export const UPDATE_LESSON = 'UPDATE_LESSON';

export const UPDATE_STEP = 'UPDATE_STEP';
export const UPDATE_STEP_STATE = 'UPDATE_STEP_STATE';

export const SET_ACTIVITY_ACTIVE_STEP = 'SET_ACTIVITY_ACTIVE_STEP';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
export const UPDATE_ACTIVITY_STATE = 'UPDATE_ACTIVITY_STATE';

export const UPDATE_USER = 'UPDATE_USER';

export const UPDATE_RECORD = 'UPDATE_RECORD';
export const DELETE_RECORD = 'DELETE_RECORD';

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
  activities: ActivityState;
  conversations: ConversationState;
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
export type ConversationState = EntityState<NormalizedConversation>;
export type StepsState = EntityState<NormalizedStep>;
export type ActivityState = EntityState<NormalizedActivity<Subject>>;
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
 * Activity
 */
export type SetActivityActiveStepAction = Action<
  typeof SET_ACTIVITY_ACTIVE_STEP,
  Step['id'],
  { id: Activity['id'] }
>;
export type UpdateActivityAction<T extends Subject> = Action<
  typeof UPDATE_ACTIVITY,
  Partial<NormalizedActivity<T>>,
  { id: Activity<never>['id'] }
>;
export type UpdateActivityStateAction = Action<
  typeof UPDATE_ACTIVITY_STATE,
  {},
  { id: Activity<never>['id'] }
>;

export type ActivityAction<T extends Subject> =
  | UpdateEntitiesAction
  | SetActivityActiveStepAction
  | UpdateActivityAction<T>
  | UpdateActivityStateAction;

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
  typeof UPDATE_RECORD,
  { value: RecordValue; meta: RecordMeta },
  { key: string }
>;

export type RecordDeleteAction = Action<
  typeof DELETE_RECORD,
  void,
  { key: string }
>;

export type RecordAction = RecordUpdateAction | RecordDeleteAction;
