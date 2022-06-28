import {
  DataResponse,
  Endpoint,
  GetRequestFetchArgs,
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
  InferRecordValueSafe,
  InferRecordValueType,
  InitRecord,
  RecipeCollection,
  RecipeMethod,
  RecordBase,
  RecordRecipe,
  RecordValue,
} from '@chess-tent/redux-record/types';
import { MiddlewareAPI } from 'redux';
import { GenericArguments } from './_helpers';
import { Requests } from './requests';

export type RecipeApiLoad<T extends RequestFetch<any, any>> = {
  load: (...args: GenericArguments<GetRequestFetchArgs<T>>) => void;
};

function getRecordInitByNamespace(
  namespace: typeof TYPE_ACTIVITY,
): Records['activity'] {
  throw new Error(
    `Unknown namespace ${namespace} - no record registered for that namespace.`,
  );
}

type UserTrainingsRecord = RecipeApiLoad<Requests['trainings']> &
  RecordBase<LessonActivity[]> &
  RecipeCollection<LessonActivity>;
type UserScheduledTrainingsRecord = RecipeApiLoad<
  Requests['scheduledTrainings']
> &
  RecordBase<LessonActivity[]> &
  RecipeCollection<LessonActivity>;
type CreateNewUserTraining = (activity: LessonActivity) => Promise<void>;
type RequestMentorship = (coach: User, student: User) => Promise<void>;
type CoachesRecord = RecipeApiLoad<Requests['coaches']> &
  RecordBase<Mentorship[]> &
  RecipeCollection<Mentorship>;
type LessonRecord = RecipeApiLoad<Requests['lesson']> & RecordBase<Lesson>;

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
    UserTrainingsRecord &
      RecipeMethod<UserTrainingsRecord, 'new', CreateNewUserTraining>
  >;
  userScheduledTrainings: InitRecord<
    UserScheduledTrainingsRecord &
      RecipeMethod<UserScheduledTrainingsRecord, 'new', CreateNewUserTraining>
  >;

  conversationParticipant: InitRecord<RecordBase<User>>;

  activity: InitRecord<
    RecordBase<T> &
      RecipeMethod<
        RecordBase<T>,
        'applyPatch',
        (modifier: (draft: RecordValue<T>) => void) => void
      >
  >;
  lesson: InitRecord<
    LessonRecord &
      RecipeMethod<LessonRecord, 'create', () => Promise<StatusResponse>>
  >;
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
    CoachesRecord &
      RecipeMethod<CoachesRecord, 'requestMentorship', RequestMentorship>
  >;

  // Service
  createRecord: typeof CreateRecord;
  getRecordInitByNamespace: typeof getRecordInitByNamespace;
  isInitialized: <T>(record: RecordBase<T>) => boolean;

  // Recipes
  withRecordBase: <V>() => RecordRecipe<RecordBase<V>>;
  withRecordCollection: <T extends RecordBase<any[]>>() => RecordRecipe<
    T,
    RecipeCollection<InferRecordValueType<T>>
  >;
  withRecordMethod: <
    T extends RecordBase<any>,
    M extends string,
    F extends (...args: any[]) => void,
  >(
    method: M,
    func: (store: MiddlewareAPI) => (record: T) => F,
  ) => RecordRecipe<T, RecipeMethod<T, M, F>>;
  // TODO - safe type `type` argument - should match selected entity
  withRecordDenormalized: <T extends RecordBase<any>>(
    type: string,
  ) => RecordRecipe<InferRecordValueSafe<T> extends Entity ? T : never>;
  withRecordDenormalizedCollection: <
    T extends RecordBase<any[]> & RecipeCollection<any>,
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
    T extends RecordBase<RESPONSE extends DataResponse<infer U> ? U : never>,
  >(
    request: R,
  ) => RecordRecipe<
    T,
    { load: (...args: GenericArguments<GetRequestFetchArgs<R>>) => void }
  >;
};
