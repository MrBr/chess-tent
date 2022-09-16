import {
  DataResponse,
  Endpoint,
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
  Entity,
  Conversation,
  LessonActivity,
  TYPE_ACTIVITY,
} from '@chess-tent/models';
import {
  CreateRecord,
  InferRecordValueType,
  RecordWith,
  RecipeCollection,
  RecipeMethod,
  RecordBase,
  RecordRecipe,
  RecordValue,
  RecipeMeta,
} from '@chess-tent/redux-record/types';
import { MiddlewareAPI } from 'redux';
import { GenericArguments } from './_helpers';
import { Requests } from './requests';

export type RecipeApiLoad<T extends RequestFetch<any, any>> = RecordBase<
  GetRequestFetchResponse<T> extends DataResponse<infer D> ? D : never,
  { loaded?: boolean; loading?: boolean }
> & {
  load: (...args: GenericArguments<GetRequestFetchArgs<T>>) => void;
};

function getRecordInitByNamespace(
  namespace: typeof TYPE_ACTIVITY,
): Records['activity'] {
  throw new Error(
    `Unknown namespace ${namespace} - no record registered for that namespace.`,
  );
}

type ActiveUserRecord = RecipeApiLoad<Requests['me']> &
  RecordBase<User> &
  RecipeMethod<'save', () => Promise<void>>;
type UserTrainingsRecord = RecipeApiLoad<Requests['trainings']> &
  RecordBase<LessonActivity[]> &
  RecipeCollection<LessonActivity> &
  RecipeMethod<'new', CreateNewUserTraining>;
type UserScheduledTrainingsRecord = RecipeApiLoad<
  Requests['scheduledTrainings']
> &
  RecordBase<LessonActivity[]> &
  RecipeCollection<LessonActivity> &
  RecipeMethod<'new', CreateNewUserTraining>;
type CreateNewUserTraining = (activity: LessonActivity) => Promise<void>;
type RequestMentorship = (coach: User, student: User) => Promise<void>;
type CoachesRecord = RecipeApiLoad<Requests['coaches']> &
  RecordBase<Mentorship[]> &
  RecipeCollection<Mentorship> &
  RecipeMethod<'requestMentorship', RequestMentorship>;
type LessonRecord = RecipeApiLoad<Requests['lesson']> &
  RecordBase<Lesson, { local?: boolean }> &
  RecipeMethod<'create', () => Promise<StatusResponse>>;

export type Records<T = any> = {
  activeUser: RecordWith<ActiveUserRecord>;
  activeUserNotifications: RecordWith<
    RecipeApiLoad<Requests['notifications']> &
      RecordBase<Notification[]> &
      RecipeCollection<Notification>
  >;
  activeUserLessons: RecordWith<
    RecipeApiLoad<Requests['myLessons']> &
      RecordBase<Lesson[]> &
      RecipeCollection<Lesson>
  >;
  activeUserConversations: RecordWith<
    RecipeApiLoad<Requests['conversations']> &
      RecordBase<Conversation[], { userId?: string }> &
      RecipeCollection<Conversation> &
      RecipeMethod<'loadMore', () => void, { allLoaded?: boolean }>
  >;

  userTrainings: RecordWith<UserTrainingsRecord>;
  userScheduledTrainings: RecordWith<UserScheduledTrainingsRecord>;

  conversationParticipant: RecordWith<RecordBase<User>>;

  activity: RecordWith<
    RecordBase<T, { loaded?: boolean; loading?: boolean }> &
      RecipeMethod<
        'applyPatch',
        (modifier: (draft: RecordValue<T>) => void) => void
      >
  >;
  lesson: RecordWith<LessonRecord>;
  lessons: RecordWith<
    RecipeApiLoad<Requests['lessons']> &
      RecordBase<Lesson[]> &
      RecipeCollection<Lesson>
  >;
  students: RecordWith<
    RecipeApiLoad<Requests['students']> &
      RecordBase<Mentorship[]> &
      RecipeCollection<Mentorship>
  >;
  coaches: RecordWith<CoachesRecord>;

  // Service
  createRecord: typeof CreateRecord;
  getRecordInitByNamespace: typeof getRecordInitByNamespace;
  isInitialized: <T>(record: RecordBase<T>) => boolean;

  // Recipes
  withRecordBase: <V, M extends {} = {}>(
    initialValue?: RecordValue<V>,
    initialMeta?: M,
  ) => RecordRecipe<{}, RecordBase<V, M>>;
  withRecordCollection: <T extends RecordBase>() => RecordRecipe<
    T,
    RecipeCollection<InferRecordValueType<T>>
  >;
  withRecordMethod: <M extends {}>() => <
    T extends RecordBase<any, any>,
    N extends string,
    F extends (...args: any[]) => void,
  >(
    method: N,
    func: (
      recordKey: string,
    ) => (store: MiddlewareAPI) => (record: T & RecipeMeta<M>) => F,
  ) => RecordRecipe<T, RecipeMethod<N, F, M>>;
  // TODO - safe type `type` argument - should match selected entity
  withRecordDenormalized: <T extends RecordBase<any, any>>(
    type: string,
  ) => RecordRecipe<InferRecordValueType<T> extends Entity ? T : never, {}>;
  withRecordDenormalizedCollection: <
    T extends RecordBase<any[], any> & RecipeCollection<any>,
  >(
    type: string,
  ) => RecordRecipe<
    InferRecordValueType<T> extends Entity ? T : never,
    { updateRaw: (ids: string[], meta?: {}) => void }
  >;
  withRecordApiLoad: <
    RESPONSE extends DataResponse<any>,
    E extends Endpoint<any, RESPONSE>,
    R extends RequestFetch<E, any>,
    T extends RecordBase<
      RESPONSE extends DataResponse<infer U> ? U : never,
      any
    >,
  >(
    request: R,
  ) => RecordRecipe<T, RecipeApiLoad<R>>;
};
