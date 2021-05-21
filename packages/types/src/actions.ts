import {
  Conversation,
  NormalizedMessage,
  Entity,
  NormalizedActivity,
  NormalizedConversation,
  NormalizedLesson,
  NormalizedStep,
  NormalizedUser,
  Subject,
  SubjectPath,
  NormalizedTag,
  Notification,
  NormalizedNotification,
  NormalizedMentorship,
  NormalizedEntity,
  ReversiblePatch,
} from '@chess-tent/models';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';
export const UPDATE_ENTITY = 'UPDATE_ENTITY';

export const SYNC_ACTION = 'SYNC_ACTION';

export const UPDATE_RECORD_VALUE = 'UPDATE_RECORD_VALUE';
export const UPDATE_RECORD = 'UPDATE_RECORD';
export const PUSH_RECORD = 'PUSH_RECORD';
export const DELETE_RECORD = 'DELETE_RECORD';

export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_PATCH = 'SEND_PATCH';

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  // push property indicates that actions is pushed from the server
  meta: M & { push?: boolean };
};

export type PathAction<T, P, M extends { path: SubjectPath }> = Action<T, P, M>;

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
export type RecordValue = Entity | Entity[] | null;
export type RecordMeta = {
  type: Entity['type'];
  loading?: boolean;
  loaded?: boolean;
};
export type RecordType<T extends RecordValue = RecordValue> = {
  value: GetRecordNormalizedValue<T> | [] | null;
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
// TODO - define a pattern for generic meta
//        probably new actions that extend updateEntity will be needed
// TODO - couple meta.type and payload if possible
//        depending on meta.type entity should infer type making it typesafe
export type UpdateEntityAction = Action<
  typeof UPDATE_ENTITY,
  NormalizedEntity,
  {
    patch?: ReversiblePatch;
    type: string;
    id: string;
  } & { [key: string]: any }
>;

export type LessonAction = UpdateEntityAction | UpdateEntitiesAction;

export type SyncAction = Action<
  typeof SYNC_ACTION,
  Entity | undefined | null,
  {
    id: string;
    type: string;
    socketId: string;
  }
>;

export type ActivityAction<T extends Subject> = UpdateEntitiesAction;

export type UserAction = UpdateEntitiesAction;

/**
 * Records
 */
export type RecordUpdateAction = Action<
  typeof UPDATE_RECORD,
  { value: RecordValue; meta?: Partial<RecordMeta> },
  { key: string }
>;
export type RecordPushAction = Action<
  typeof PUSH_RECORD,
  { value: RecordValue; },
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
  | RecordPushAction
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
  | RecordAction
  | SyncAction
  | UpdateEntitiesAction
  | PatchAction
  | MessageAction
  | NotificationAction
  | ConversationAction
  | LessonAction
  | UserAction
  | ActivityAction<any>;
