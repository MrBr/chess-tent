import {
  Conversation,
  NormalizedMessage,
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
  Chapter,
  SubjectPath
} from "@chess-tent/models";

export const UPDATE_ENTITIES = "UPDATE_ENTITIES";

export const UPDATE_LESSON_STEP = "UPDATE_LESSON_STEP";
export const UPDATE_LESSON_CHAPTER = "UPDATE_LESSON_CHAPTER";
export const ADD_LESSON_CHAPTER = "ADD_LESSON_CHAPTER";
export const UPDATE_LESSON_PATH = "UPDATE_LESSON_PATH";
export const UPDATE_LESSON = "UPDATE_LESSON";

export const SET_ACTIVITY_ACTIVE_STEP = "SET_ACTIVITY_ACTIVE_STEP";
export const UPDATE_ACTIVITY = "UPDATE_ACTIVITY";
export const UPDATE_ACTIVITY_STATE = "UPDATE_ACTIVITY_STATE";

export const UPDATE_USER = "UPDATE_USER";

export const UPDATE_RECORD = "UPDATE_RECORD";
export const DELETE_RECORD = "DELETE_RECORD";

export const SEND_MESSAGE = "SEND_MESSAGE";

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  // push property indicates that actions is pushed from the server
  meta: M & { push?: boolean };
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
export type UpdateLessonChapterAction = Action<
  typeof UPDATE_LESSON_CHAPTER,
  Chapter,
  { lessonId: Lesson["id"]; chapterId: Chapter["id"]; path: SubjectPath }
>;
export type AddLessonChapterAction = Action<
  typeof ADD_LESSON_CHAPTER,
  Chapter,
  { lessonId: Lesson["id"]; path: SubjectPath }
>;
export type UpdateLessonStepAction = Action<
  typeof UPDATE_LESSON_STEP,
  Step,
  { lessonId: Lesson["id"]; chapterId: Chapter["id"]; path: SubjectPath }
>;

export type UpdateLessonPathAction<
  T extends keyof Lesson = keyof Lesson,
  K extends keyof Lesson["state"] = keyof Lesson["state"]
> = Action<
  typeof UPDATE_LESSON_PATH,
  T extends "state" ? Lesson[T][K] : Lesson[T],
  {
    lessonId: Lesson["id"];
    path: T extends "state" ? [T, K] : [T];
  }
>;
export type UpdateLessonAction = Action<
  typeof UPDATE_LESSON,
  Omit<NormalizedLesson, "type" | "id">,
  { id: Lesson["id"] }
>;

export type LessonAction =
  | UpdateEntitiesAction
  | UpdateLessonAction
  | UpdateLessonPathAction
  | UpdateLessonStepAction
  | UpdateLessonChapterAction
  | AddLessonChapterAction;

/**
 * Activity
 */
export type SetActivityActiveStepAction = Action<
  typeof SET_ACTIVITY_ACTIVE_STEP,
  Step["id"],
  { id: Activity["id"] }
>;
export type UpdateActivityAction<T extends Subject> = Action<
  typeof UPDATE_ACTIVITY,
  NormalizedActivity<T>,
  { id: Activity<never>["id"] }
>;
export type UpdateActivityStateAction = Action<
  typeof UPDATE_ACTIVITY_STATE,
  {},
  { id: Activity<never>["id"] }
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
  { id: User["id"] }
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

/**
 * Message
 */
export type MessageAction = SendMessageAction;

export type SendMessageAction = Action<
  typeof SEND_MESSAGE,
  NormalizedMessage,
  { conversationId: Conversation["id"] }
>;

/**
 * Conversation
 */
export type ConversationAction = UpdateEntitiesAction | SendMessageAction;

export type Actions =
  | SendMessageAction
  | ConversationAction
  | LessonAction
  | UserAction
  | ActivityAction<any>;
