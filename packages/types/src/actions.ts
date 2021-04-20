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
  LessonDetails,
  SubjectPath,
  NormalizedTag,
  Notification,
  NormalizedNotification,
  NormalizedMentorship,
} from '@chess-tent/models';

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';

export const UPDATE_LESSON_STEP = 'UPDATE_LESSON_STEP';
export const UPDATE_LESSON_CHAPTER = 'UPDATE_LESSON_CHAPTER';
export const ADD_LESSON_CHAPTER = 'ADD_LESSON_CHAPTER';
export const ADD_LESSON_DETAILS_TO_LESSON_VERSIONS = 'ADD_LESSON_DETAILS_TO_LESSON_VERSIONS';
export const UPDATE_LESSON_PATH = 'UPDATE_LESSON_PATH';

export const UPDATE_ACTIVITY_STEP_STATE = 'UPDATE_ACTIVITY_STEP_STATE';
export const UPDATE_ACTIVITY_STEP_ANALYSIS =
  'UPDATE_ACTIVITY_STEP_STATE_ANALYSIS';
export const UPDATE_ACTIVITY_PROPERTY = 'UPDATE_ACTIVITY_PROPERTY';

export const UPDATE_USER = 'UPDATE_USER';

export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';

export const UPDATE_RECORD_VALUE = 'UPDATE_RECORD_VALUE';
export const UPDATE_RECORD = 'UPDATE_RECORD';
export const DELETE_RECORD = 'DELETE_RECORD';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  // push property indicates that actions is pushed from the server
  meta: M & { push?: boolean };
};

export type PathAction<T, P, M extends { path: SubjectPath }> = Action<T, P, M>;

export type EntityState<T> = { [key: string]: T };
export type EntitiesState = {
  users: UserState;
  lessons: LessonState;
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
export type RecordValue = Entity | Entity[];
export type RecordMeta = { type: Entity['type'] };
export type RecordType = {
  value: string | string[];
  meta: RecordMeta;
};
export type RecordState = Record<string, RecordType>;
export type MetaState = Record<string, any>;
export type LessonState = EntityState<NormalizedLesson>;
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

/**
 * Lesson
 */
export type UpdateLessonChapterAction = PathAction<
  typeof UPDATE_LESSON_CHAPTER,
  Chapter,
  { lessonId: Lesson['id']; chapterId: Chapter['id']; path: SubjectPath }
>;
export type AddLessonChapterAction = PathAction<
  typeof ADD_LESSON_CHAPTER,
  Chapter,
  { lessonId: Lesson['id']; path: SubjectPath }
>;
export type AddLessonDetailsToLessonVersionsAction = PathAction<
  typeof ADD_LESSON_DETAILS_TO_LESSON_VERSIONS,
  LessonDetails,
  { lessonId: Lesson['id']; path: SubjectPath }
>;
export type UpdateLessonStepAction = PathAction<
  typeof UPDATE_LESSON_STEP,
  Step,
  { lessonId: Lesson['id']; chapterId: Chapter['id']; path: SubjectPath }
>;

export type UpdateLessonPathAction<
  T extends keyof NormalizedLesson = keyof NormalizedLesson,
  K extends keyof NormalizedLesson['state'] = keyof NormalizedLesson['state']
> = PathAction<
  typeof UPDATE_LESSON_PATH,
  T extends 'state' ? NormalizedLesson[T][K] : NormalizedLesson[T],
  {
    lessonId: NormalizedLesson['id'];
    path: T extends 'state' ? [T, K] : [T];
  }
>;

export type LessonAction =
  | UpdateEntitiesAction
  | UpdateLessonPathAction
  | UpdateLessonStepAction
  | UpdateLessonChapterAction
  | AddLessonChapterAction
  | AddLessonDetailsToLessonVersionsAction;

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

export type ActivityAction<T extends Subject> =
  | UpdateEntitiesAction
  | UpdateActivityStepAction
  | UpdateActivityPropertyAction;

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
export type UpdateMessageAction = Action<
  typeof UPDATE_MESSAGE,
  Partial<NormalizedMessage>,
  { conversationId: Conversation['id']; messageId: NormalizedMessage['id'] }
>;
export type MessageAction = SendMessageAction | UpdateMessageAction;

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

export type UpdateNotificationAction = Action<
  typeof UPDATE_NOTIFICATION,
  NormalizedNotification,
  { id: Notification['id'] }
>;
export type NotificationAction =
  | UpdateEntitiesAction
  | SendNotificationAction
  | UpdateNotificationAction;

export type Actions =
  | MessageAction
  | NotificationAction
  | ConversationAction
  | LessonAction
  | UserAction
  | ActivityAction<any>;
