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

export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_PATCH = 'SEND_PATCH';

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  // push property indicates that actions is pushed from the server
  meta: M & { push?: boolean };
};

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
    // Signals record reducer that the record has been synced
    recordKey?: string;
    push?: boolean;
  }
>;

export type ActivityAction<T extends Subject> = UpdateEntitiesAction;

export type UserAction = UpdateEntitiesAction;

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
  | SyncAction
  | UpdateEntitiesAction
  | PatchAction
  | MessageAction
  | NotificationAction
  | ConversationAction
  | LessonAction
  | UserAction
  | ActivityAction<any>;
