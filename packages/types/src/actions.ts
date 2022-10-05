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
  NormalizedTag,
  NormalizedNotification,
  NormalizedMentorship,
  NormalizedEntity,
  ReversiblePatch,
} from '@chess-tent/models';

export const RESET_STATE = 'RESET_STATE';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';
export const UPDATE_ENTITY = 'UPDATE_ENTITY';
export const DELETE_ENTITY = 'DELETE_ENTITY';

export const SYNC_ACTION = 'SYNC_ACTION';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_PATCH = 'SEND_PATCH';

export const CONFERENCING_ANSWER = 'CONFERENCING_ANSWER';
export const CONFERENCING_ICECANDIDATE = 'CONFERENCING_ICECANDIDATE';
export const CONFERENCING_OFFER = 'CONFERENCING_OFFER';

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
  messages: MessagesState;
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
export type MessagesState = EntityState<NormalizedMessage>;

export interface AppState {
  entities: EntitiesState;
  meta: MetaState;
}

export type ResetStateAction = Action<typeof RESET_STATE, void>;

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
  { result?: NormalizedEntity; entities: Partial<EntitiesState> },
  {
    patch?: ReversiblePatch;
    type: keyof EntitiesState;
    id: string;
  } & { [key: string]: any }
>;
export type DeleteEntityAction = Action<
  typeof DELETE_ENTITY,
  undefined,
  {
    type: keyof EntitiesState;
    id: string;
  }
>;

// TODO - rename to EntityAction
export type LessonAction =
  | UpdateEntityAction
  | UpdateEntitiesAction
  | DeleteEntityAction;

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
 * Patch
 */
export type SendPatchAction = Action<
  typeof SEND_PATCH,
  {
    patch: ReversiblePatch['next'];
    entities: Partial<EntitiesState>;
  },
  { type: string; id: string }
>;

export type PatchAction = SendPatchAction;

type SenderReceiverBase<T> = {
  fromUserId: string;
  toUserId: string;
  room: string;
  message: T;
};

export type OfferAction = Action<
  typeof CONFERENCING_OFFER,
  SenderReceiverBase<RTCSessionDescriptionInit>,
  { final?: boolean }
>;

export type AnswerAction = Action<
  typeof CONFERENCING_ANSWER,
  SenderReceiverBase<RTCSessionDescriptionInit>
>;

export type ICECandidateAction = Action<
  typeof CONFERENCING_ICECANDIDATE,
  SenderReceiverBase<string>
>;

export type ConferencingAction =
  | OfferAction
  | AnswerAction
  | ICECandidateAction;

export type Actions =
  | ResetStateAction
  | UpdateEntityAction
  | SyncAction
  | UpdateEntitiesAction
  | PatchAction
  | MessageAction
  | ConversationAction
  | LessonAction
  | UserAction
  | ActivityAction<any>
  | ConferencingAction;
