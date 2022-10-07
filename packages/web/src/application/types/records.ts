import {
  DataResponse,
  GetRequestFetchArgs,
  GetRequestFetchResponse,
  RequestFetch,
  StatusResponse,
} from '@chess-tent/types';
import {
  Lesson,
  Mentorship,
  User,
  Notification,
  Conversation,
  LessonActivity,
  TYPE_ACTIVITY,
  Activity,
} from '@chess-tent/models';
import {
  CreateRecord,
  RecordWith,
  RecipeCollection,
  RecipeMethod,
  RecordBase,
  RecordValue,
  MF,
  InitedRecord,
  RecordEntry,
  RecordEntryType,
  InferRecordValue,
} from '@chess-tent/redux-record/types';
import { collectionRecipe } from '@chess-tent/redux-record';
import { GenericArguments } from './_helpers';
import { Requests } from './requests';

export interface RecipeDenormalized<T>
  extends RecordEntryType<T, { normalized: true }> {
  get: MF<() => RecordEntry<T, this['$meta']>, RecordBase<T>>;
}

export interface RecipeDenormalizedCollection<T>
  extends RecordEntryType<T[], { normalized: true }> {
  get: MF<
    () => RecordEntry<T[], this['$meta']>,
    RecordBase<T[]> & RecipeCollection<T>
  >;
}

export interface RecipeApiLoad<R extends RequestFetch<any, any>>
  extends RecordEntryType<
    GetRequestFetchResponse<R> extends DataResponse<infer D> ? D : never,
    { loaded?: boolean; loading?: boolean }
  > {
  load: MF<
    (...args: GenericArguments<GetRequestFetchArgs<R>>) => void,
    RecordBase<
      GetRequestFetchResponse<R> extends DataResponse<infer D> ? D : never
    >
  >;
}

function getRecordInitByNamespace(
  namespace: typeof TYPE_ACTIVITY,
): Records['activity'] {
  throw new Error(
    `Unknown namespace ${namespace} - no record registered for that namespace.`,
  );
}

export type ActivityRecord<T extends Activity> = RecordBase<
  T,
  { loaded?: boolean; loading?: boolean }
> &
  RecipeDenormalized<T> &
  RecipeMethod<
    'applyPatch',
    (modifier: (draft: RecordValue<T>) => void) => void,
    T
  > &
  RecordBase<T>;
export type ActiveUserConversationsRecord = RecordBase<
  Conversation[],
  { userId?: string }
> &
  RecipeMethod<
    'loadMore',
    () => Promise<void>,
    Conversation[],
    { allLoaded?: boolean }
  > &
  RecipeApiLoad<Requests['conversations']> &
  RecipeDenormalizedCollection<Conversation> &
  RecipeCollection<Conversation>;

export type ConversationParticipantRecord = RecordBase<User> &
  RecipeDenormalized<User>;
export type ActiveUserNotificationsRecord = RecordBase<Notification[]> &
  RecipeApiLoad<Requests['notifications']> &
  RecipeDenormalizedCollection<Notification> &
  RecipeCollection<Notification>;
export type ActiveUserLessonsRecord = RecipeCollection<Lesson> &
  RecipeApiLoad<Requests['myLessons']> &
  RecordBase<Lesson[]>;
export type ActiveUserRecord = RecordBase<User> &
  RecipeDenormalized<User> &
  RecipeMethod<'save', () => Promise<void>, User> &
  RecipeApiLoad<Requests['me']>;
export type UserTrainingsRecord = RecipeMethod<
  'new',
  CreateNewUserTraining,
  LessonActivity[]
> &
  RecipeApiLoad<Requests['trainings']> &
  RecipeCollection<LessonActivity> &
  RecordBase<LessonActivity[]>;
export type UserScheduledTrainingsRecord = RecipeMethod<
  'new',
  CreateNewUserTraining,
  LessonActivity[]
> &
  RecipeApiLoad<Requests['scheduledTrainings']> &
  RecordBase<LessonActivity[]> &
  RecipeDenormalizedCollection<LessonActivity>;
export type CreateNewUserTraining = (activity: LessonActivity) => Promise<void>;
export type RequestMentorship = (coach: User, student: User) => Promise<void>;
export type CoachesRecord = RecordBase<Mentorship[]> &
  RecipeMethod<'requestMentorship', RequestMentorship, Mentorship[]> &
  RecipeApiLoad<Requests['myCoaches']> &
  RecipeDenormalizedCollection<Mentorship> &
  RecipeCollection<Mentorship>;
export type StudentsRecord = RecipeApiLoad<Requests['myStudents']> &
  RecordBase<Mentorship[]> &
  RecipeDenormalizedCollection<Mentorship>;
export type LessonRecord = RecipeMethod<
  'create',
  () => Promise<StatusResponse>,
  Lesson
> &
  RecipeApiLoad<Requests['lesson']> &
  RecordBase<Lesson, { local?: boolean }> &
  RecipeDenormalized<Lesson>;
export type LessonsRecord = RecipeApiLoad<Requests['lessons']> &
  RecordBase<Lesson[]> &
  RecipeCollection<Lesson>;

export type Records<T extends Activity = Activity> = {
  activeUser: RecordWith<ActiveUserRecord>;
  activeUserNotifications: RecordWith<ActiveUserNotificationsRecord>;
  activeUserLessons: RecordWith<ActiveUserLessonsRecord>;
  activeUserConversations: RecordWith<ActiveUserConversationsRecord>;

  userTrainings: RecordWith<UserTrainingsRecord>;
  userScheduledTrainings: RecordWith<UserScheduledTrainingsRecord>;

  conversationParticipant: RecordWith<RecordBase<User>>;

  activity: RecordWith<ActivityRecord<T>>;
  lesson: RecordWith<LessonRecord>;
  lessons: RecordWith<LessonsRecord>;
  myStudents: RecordWith<StudentsRecord>;
  myCoaches: RecordWith<CoachesRecord>;

  // Service
  createRecord: CreateRecord;
  getRecordInitByNamespace: typeof getRecordInitByNamespace;
  isInitialized: <T extends InitedRecord<any>>(record: T) => boolean;

  // Recipes
  collectionRecipe: typeof collectionRecipe;
  // TODO - safe type `type` argument - should match selected entity
  createDenormalizedRecipe: <T extends RecordBase<any, any>>(
    type: T extends RecordBase<infer E>
      ? E extends { type: infer TYPE }
        ? TYPE
        : never
      : never,
  ) => { get: MF<() => any, T>; initialMeta: { normalized: true } };
  createDenormalizedCollectionRecipe: <
    T extends RecordBase<any[], any> & RecipeCollection<any, any>,
  >(
    type: T extends RecordBase<infer E>
      ? E extends Array<infer V>
        ? V extends { type: infer TYPE }
          ? TYPE
          : never
        : never
      : never,
  ) => { get: MF<() => any, T>; initialMeta: { normalized: true } };
  createApiRecipe: <
    T extends RecordBase<any, any>,
    R extends RequestFetch<any, any>,
  >(
    request: GetRequestFetchResponse<R> extends DataResponse<infer D>
      ? D extends InferRecordValue<T>
        ? R
        : never
      : never,
  ) => {
    load: MF<(...args: GenericArguments<GetRequestFetchArgs<R>>) => void, T>;
  };
};
