import {
  Conversation,
  NormalizedMessage,
  Entity,
  Activity,
  NormalizedActivity,
  NormalizedConversation,
  NormalizedLesson,
  NormalizedStep,
  NormalizedUser,
  Subject,
  User,
  SubjectPath,
  NormalizedTag,
  Notification,
  NormalizedNotification,
  NormalizedMentorship,
  NormalizedEntity,
  ReversiblePatch,
} from '@chess-tent/models';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

export const UPDATE_LESSON_STEP = 'UPDATE_LESSON_STEP';
export const UPDATE_LESSON_CHAPTER = 'UPDATE_LESSON_CHAPTER';
export const ADD_LESSON_CHAPTER = 'ADD_LESSON_CHAPTER';
export const UPDATE_LESSON_PATH = 'UPDATE_LESSON_PATH';

export const UPDATE_ACTIVITY_STEP_STATE = 'UPDATE_ACTIVITY_STEP_STATE';
export const UPDATE_ACTIVITY_STEP_ANALYSIS =
  'UPDATE_ACTIVITY_STEP_STATE_ANALYSIS';
export const UPDATE_ACTIVITY_PROPERTY = 'UPDATE_ACTIVITY_PROPERTY';
export const SYNC_ACTIVITY_REQUEST = 'SYNC_ACTIVITY_REQUEST';
export const SYNC_ACTIVITY = 'SYNC_ACTIVITY';

export const UPDATE_USER = 'UPDATE_USER';

export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';
export const UPDATE_ENTITY = 'UPDATE_ENTITY';

export const UPDATE_RECORD_VALUE = 'UPDATE_RECORD_VALUE';
export const UPDATE_RECORD = 'UPDATE_RECORD';
export const DELETE_RECORD = 'DELETE_RECORD';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_PATCH = 'SEND_PATCH';

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  // push property indicates that actions is pushed from the server
  meta: M & { push?: boolean };
};

export type PathAction<T, P, M extends { path: SubjectPath }> = Action<T, P, M>;
export type SocketAction<T, P, M extends { entityId: string, fromSocketId?: string, toSocketId: string }> = Action<T, P, M>;
export type GetActionMeta<T extends Action<any, any>> = T extends Action<
  any,
  any,
  infer M
>
  ? M
  : never;

export type EntityState<T> = { [key: string]: T };
export type EntitiesState = {
  users: UserState;
  lessons: AppLessonState;
  steps: StepsState;
  activities: ActivityState;
  conversations: ConversationState;
  tags: TagState;
  notifications: NotificationState;
  mentorship: MentorshipState;
};
/**
 * Records are used to store single entity reference
 * or a collection which have domain meaning.
 * Records represent complex data model which holds
 * both data and metadata about the record.
 */
export type RecordValueNormalizedSingle = string;
export type RecordValueNormalizedList = string[];
export type RecordValueNormalized =
  | RecordValueNormalizedSingle
  | RecordValueNormalizedList;
export type GetRecordNormalizedValue<T extends RecordValue> = T extends Entity[]
  ? RecordValueNormalizedList
  : T extends Entity
  ? RecordValueNormalizedSingle
  : RecordValueNormalized;
export type RecordValue = Entity | Entity[];
export type RecordMeta = { type: Entity['type'] };
export type RecordType<T extends RecordValue = RecordValue> = {
  value: GetRecordNormalizedValue<T>;
  meta: RecordMeta;
};
export type RecordState = Record<string, RecordType>;
export type MetaState = Record<string, any>;
export type AppLessonState = EntityState<NormalizedLesson>;
export type ConversationState = EntityState<NormalizedConversation>;
export type NotificationState = EntityState<NormalizedNotification>;
export type StepsState = EntityState<NormalizedStep>;
export type ActivityState = EntityState<NormalizedActivity<Subject>>;
export type UserState = EntityState<NormalizedUser>;
export type TagState = EntityState<NormalizedTag>;
export type MentorshipState = EntityState<NormalizedMentorship>;

export interface AppState {
  entities: EntitiesState;
  records: RecordState;
  meta: MetaState;
}

export type UpdateEntitiesAction = Action<
  typeof UPDATE_ENTITIES,
  EntitiesState
>;
export type UpdateEntityAction = Action<
  typeof UPDATE_ENTITY,
  NormalizedEntity,
  {
    patch?: ReversiblePatch;
    type: string;
    id: string;
  }
>;

export type LessonAction = UpdateEntityAction | UpdateEntitiesAction;

/**
 * Activity
 */
export type UpdateActivityStepAction = PathAction<
  typeof UPDATE_ACTIVITY_STEP_STATE,
  any,
  { activityId: Activity['id']; path: SubjectPath }
>;
export type UpdateActivityStepAnalysisAction = PathAction<
  typeof UPDATE_ACTIVITY_STEP_ANALYSIS,
  any,
  { activityId: Activity['id']; path: SubjectPath }
>;
export type UpdateActivityPropertyAction<
  T extends keyof NormalizedActivity = keyof NormalizedActivity,
  K extends keyof NormalizedActivity['state'] = keyof NormalizedActivity['state']
> = PathAction<
  typeof UPDATE_ACTIVITY_PROPERTY,
  T extends 'state' ? NormalizedActivity[T][K] : NormalizedActivity[T],
  {
    activityId: NormalizedActivity['id'];
    path: T extends 'state' ? [T, K] : [T];
  }
>;
export type SyncActivityRequestAction = SocketAction<
  typeof SYNC_ACTIVITY_REQUEST,
  undefined,
  {
    entityId: NormalizedActivity['id'];
    fromSocketId?: string,
    toSocketId: string,
  }
>;
export type SyncActivityAction = SocketAction<
  typeof SYNC_ACTIVITY,
  // TODO: What to put here? Web complains if I put Activity | NormalizedActivity.
  any,
  {
    entityId: NormalizedActivity['id'];
    fromSocketId?: string,
    toSocketId: string,
  }
>;

export type ActivitySyncAction = 
  | SyncActivityRequestAction
  | SyncActivityAction;

export type ActivityAction<T extends Subject> =
  | UpdateEntitiesAction
  | ActivitySyncAction;

/**
 * User
 */
export type UpdateUserAction = Action<
  typeof UPDATE_USER,
  Partial<User>,
  { id: User['id'] }
>;

export type UserAction = UpdateEntitiesAction;

/**
 * Records
 */
export type RecordUpdateAction = Action<
  typeof UPDATE_RECORD,
  { value: RecordValue; meta: RecordMeta },
  { key: string }
>;
export type RecordUpdateValueAction = Action<
  typeof UPDATE_RECORD_VALUE,
  RecordType['value'],
  { key: string; type: RecordMeta['type'] }
>;

export type RecordDeleteAction = Action<
  typeof DELETE_RECORD,
  void,
  { key: string }
>;

export type RecordAction =
  | RecordUpdateAction
  | RecordDeleteAction
  | RecordUpdateValueAction;

/**
 * Message
 */

export type SendMessageAction = Action<
  typeof SEND_MESSAGE,
  NormalizedMessage,
  { conversationId: Conversation['id'] }
>;
export type MessageAction = SendMessageAction;

/**
 * Conversation
 */
export type ConversationAction = UpdateEntitiesAction | SendMessageAction;

/**
 * Notification
 */
export type SendNotificationAction = Action<
  typeof SEND_NOTIFICATION,
  Notification
>;

export type NotificationAction = UpdateEntitiesAction | SendNotificationAction;

/**
 * Patch
 */
export type SendPatchAction = Action<
  typeof SEND_PATCH,
  ReversiblePatch,
  { type: string; id: string }
>;

export type PatchAction = SendPatchAction;

export type Actions =
  | UpdateEntityAction
  | UpdateEntitiesAction
  | PatchAction
  | MessageAction
  | NotificationAction
  | ConversationAction
  | LessonAction
  | UserAction
  | ActivityAction<any>;
