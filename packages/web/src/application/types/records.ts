import { DataResponse, RequestFetch, Requests } from '@chess-tent/types';
import {
  Lesson,
  Mentorship,
  User,
  Notification,
  Entity,
  Conversation,
  LessonActivity,
  TYPE_ACTIVITY,
} from '@chess-tent/models';
import {
  CreateRecord,
  InferRecordValueSafe,
  InferRecordValueType,
  InitRecord,
  RecipeCollection,
  RecordBase,
  RecordRecipe,
} from '@chess-tent/redux-record/types';

export type RecipeApiLoad<T extends RequestFetch<any, any>> = {
  load: (...args: Parameters<T>) => void;
};

function getRecordInitByNamespace(
  namespace: typeof TYPE_ACTIVITY,
): Records['activity'] {
  throw new Error(
    `Unknown namespace ${namespace} - no record registered for that namespace.`,
  );
}

export type Records<T = any> = {
  activeUser: InitRecord<RecipeApiLoad<Requests['me']> & RecordBase<User>>;
  activeUserNotifications: InitRecord<
    RecipeApiLoad<Requests['notifications']> &
      RecordBase<Notification[]> &
      RecipeCollection<Notification>
  >;
  activeUserLessons: InitRecord<
    RecipeApiLoad<Requests['myLessons']> &
      RecordBase<Lesson[]> &
      RecipeCollection<Lesson>
  >;
  activeUserConversations: InitRecord<
    RecipeApiLoad<Requests['conversations']> &
      RecordBase<Conversation[]> &
      RecipeCollection<Conversation>
  >;

  userTrainings: InitRecord<
    RecipeApiLoad<Requests['activities']> &
      RecordBase<LessonActivity[]> &
      RecipeCollection<LessonActivity>
  >;

  conversationParticipant: InitRecord<RecordBase<User>>;

  activity: InitRecord<RecordBase<T>>;
  lesson: InitRecord<RecipeApiLoad<Requests['lesson']> & RecordBase<Lesson>>;
  lessons: InitRecord<
    RecipeApiLoad<Requests['lessons']> &
      RecordBase<Lesson[]> &
      RecipeCollection<Lesson>
  >;
  students: InitRecord<
    RecipeApiLoad<Requests['students']> &
      RecordBase<Mentorship[]> &
      RecipeCollection<Mentorship>
  >;
  coaches: InitRecord<
    RecipeApiLoad<Requests['coaches']> &
      RecordBase<Mentorship[]> &
      RecipeCollection<Mentorship>
  >;

  // Service
  createRecord: typeof CreateRecord;
  getRecordInitByNamespace: typeof getRecordInitByNamespace;

  // Recipes
  withRecordBase: <V>() => RecordRecipe<RecordBase<V>>;
  withRecordCollection: <T extends RecordBase<any[]>>() => RecordRecipe<
    T,
    RecipeCollection<InferRecordValueType<T>>
  >;
  // TODO - safe type `type` argument - should match selected entity
  withRecordDenormalized: <T extends RecordBase<any>>(
    type: string,
  ) => RecordRecipe<InferRecordValueSafe<T> extends Entity ? T : never>;
  withRecordDenormalizedCollection: <
    T extends RecordBase<any[]> & RecipeCollection<any>
  >(
    type: string,
  ) => RecordRecipe<InferRecordValueType<T> extends Entity ? T : never>;
  withRecordApiLoad: <A, V, T extends RecordBase<V>>(
    request: RequestFetch<A, DataResponse<V>>,
  ) => RecordRecipe<
    T,
    { load: (...args: Parameters<RequestFetch<A, DataResponse<V>>>) => void }
  >;
};
