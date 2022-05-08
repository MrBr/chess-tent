import {
  Activity,
  Conversation,
  Lesson,
  SubjectPath,
  Message,
  NormalizedMessage,
  User,
  Tag,
  Difficulty,
  CoachEloRange,
  Mentorship,
  NormalizedMentorship,
  Notification,
  SubjectPathUpdate,
  TYPE_LESSON,
  LessonActivity,
} from '@chess-tent/models';
import { GenericArguments } from './_helpers';
import { LessonAction } from './actions';

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type LessonsRequest = {
  owner?: User['id'];
  users?: User['id'][];
  search?: string;
  tagIds?: Tag['id'][];
  difficulty?: Difficulty;
  hasDocId?: boolean;
  published?: boolean;
};
export type MyLessonsRequest = Omit<LessonsRequest, 'users' | 'owner'>;
export type UpdateNotificationsRequest = {
  ids: Notification['id'][];
  updates: Partial<Pick<Notification, 'seen' | 'read' | 'state' | 'timestamp'>>;
};
export type Pagination = number | undefined;

export interface StatusResponse {
  error: string | null;
}
export interface SignedImageResponse extends StatusResponse {
  data: string;
}
export interface DataResponse<T> extends StatusResponse {
  data: T;
}
export interface UserResponse extends DataResponse<User> {}
export interface UsersResponse extends DataResponse<User[]> {}
export interface LessonResponse extends DataResponse<Lesson> {}
export interface LessonsResponse extends DataResponse<Lesson[]> {}
export interface ActivityResponse extends DataResponse<Activity> {}
export interface ActivitiesResponse<T extends Activity = Activity>
  extends DataResponse<T[]> {}
export interface ConversationsResponse extends DataResponse<Conversation[]> {}
export interface ConversationResponse extends DataResponse<Conversation> {}
export interface ConversationMessagesResponse
  extends DataResponse<NormalizedMessage[]> {}
export interface CoachesResponse extends DataResponse<Mentorship[]> {}
export interface RequestMentorshipResponse
  extends DataResponse<NormalizedMentorship> {}
export interface StudentsResponse extends DataResponse<Mentorship[]> {}
export interface NotificationsResponse extends DataResponse<Notification[]> {}
export interface TagsResponse extends DataResponse<Tag[]> {}

export interface ActivityFilters {
  users?: User['id'] | User['id'][];
  subject?: string;
  subjectType?: string;
  date?: DateRange;
  weekly?: boolean;
}

export interface LessonActivityFilters extends ActivityFilters {
  subjectType: typeof TYPE_LESSON;
}
export interface ScheduledLessonActivityFilters extends LessonActivityFilters {
  date: DateRange;
}

export type ApiMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface Request<METHOD extends ApiMethods, URL extends string, DATA> {
  url: URL;
  method: METHOD;
  data?: DATA;
  headers?: {};
}
export interface RequestGet<URL extends string>
  extends Request<'GET', URL, undefined> {}
export interface RequestPost<URL extends string, DATA>
  extends Request<'POST', URL, DATA> {}
export interface RequestPut<URL extends string, DATA>
  extends Request<'PUT', URL, DATA> {}
export interface RequestDelete<URL extends string>
  extends Request<'DELETE', URL, undefined> {}

export interface API {
  basePath: string;
  makeRequest: <ENDPOINT extends Endpoint<any, any>>(
    request: GetEndpointRequest<ENDPOINT>,
  ) => Promise<GetEndpointResponse<ENDPOINT>>;
}

export interface Endpoint<
  REQUEST extends Request<any, any, any>,
  RESPONSE extends StatusResponse,
> {
  request: REQUEST;
  response: RESPONSE;
}

export type GetEndpointRequest<T extends Endpoint<any, any>> =
  T extends Endpoint<infer REQUEST, infer R> ? REQUEST : never;
export type GetEndpointData<T extends Endpoint<any, any>> = T extends Endpoint<
  infer REQUEST,
  infer R
>
  ? REQUEST extends Request<infer M, infer U, infer DATA>
    ? DATA
    : never
  : never;
export type GetEndpointMethod<T extends Endpoint<any, any>> =
  T extends Endpoint<infer REQUEST, infer R>
    ? REQUEST extends Request<infer METHOD, infer U, infer D>
      ? METHOD
      : never
    : never;
export type GetEndpointUrl<T extends Endpoint<any, any>> = T extends Endpoint<
  infer REQUEST,
  infer R
>
  ? REQUEST extends Request<infer M, infer URL, infer D>
    ? URL
    : never
  : never;

export type GetEndpointResponse<T extends Endpoint<any, any>> =
  T extends Endpoint<infer R, infer RESPONSE> ? RESPONSE : never;

export type RequestFetch<
  ENDPOINT extends Endpoint<any, any>,
  T = GetEndpointData<ENDPOINT>,
> = (...args: GenericArguments<T>) => Promise<GetEndpointResponse<ENDPOINT>>;

export type GetRequestFetchEndpoint<T> = T extends RequestFetch<
  infer ENDPOINT,
  infer RESPONSE
>
  ? ENDPOINT
  : never;
export type GetRequestFetchArgs<T extends RequestFetch<any, any>> =
  T extends RequestFetch<infer E, infer ARGS> ? ARGS : never;
export type GetRequestFetchData<T extends RequestFetch<any, any>> =
  GetEndpointData<GetRequestFetchEndpoint<T>>;
export type GetRequestFetchMethod<T extends RequestFetch<any, any>> =
  GetEndpointMethod<GetRequestFetchEndpoint<T>>;
export type GetRequestFetchUrl<T extends RequestFetch<any, any>> =
  GetEndpointUrl<GetRequestFetchEndpoint<T>>;
export type GetRequestFetchResponse<T extends RequestFetch<any, any>> =
  GetEndpointResponse<GetRequestFetchEndpoint<T>>;

export type RequestState<T> = {
  response: T | null;
  loading: boolean;
  error: string | null;
};
export type LessonUpdatableAction = LessonAction;
export type LessonUpdates = { path: SubjectPath; value: any }[];

export type RegisterOptions = {
  referrer?: User['id'];
};

export type RegisterRequestParams = {
  user: Partial<User>;
  options: RegisterOptions;
};

export type InviteUserParams = {
  email: User['email'];
  link: string;
};

export interface Endpoints {
  // User endpoints
  register: Endpoint<
    RequestPost<'/register', RegisterRequestParams>,
    UserResponse
  >;
  inviteUser: Endpoint<
    RequestPost<'/invite-user', InviteUserParams>,
    StatusResponse
  >;
  login: Endpoint<
    RequestPost<'/login', Pick<User, 'email' | 'password'>>,
    UserResponse
  >;
  logout: Endpoint<RequestGet<'/logout'>, StatusResponse>;
  me: Endpoint<RequestGet<'/me'>, UserResponse>;
  updateMe: Endpoint<RequestPut<'/me', Partial<User>>, UserResponse>;
  users: Endpoint<
    RequestPost<
      '/users',
      {
        coach?: boolean;
        name?: string;
        search?: string;
        studentElo?: CoachEloRange;
        tagIds?: Tag['id'][];
      }
    >,
    UsersResponse
  >;
  user: Endpoint<RequestGet<`/user/${string}`>, UserResponse>;
  // Lesson endpoints
  lesson: Endpoint<RequestGet<`/lesson/${string}`>, LessonResponse>;
  lessonDelete: Endpoint<RequestDelete<`/lesson/${string}`>, StatusResponse>;
  lessonSave: Endpoint<RequestPost<'/lesson/save', Lesson>, StatusResponse>;
  lessonPublish: Endpoint<
    RequestPut<`/lesson/publish/${string}`, {}>,
    StatusResponse
  >;
  lessonUnpublish: Endpoint<
    RequestPut<`/lesson/unpublish/${string}`, {}>,
    StatusResponse
  >;
  lessonPatch: Endpoint<
    RequestPut<`/lesson/${string}`, Partial<Lesson>>,
    StatusResponse
  >;
  lessonUpdates: Endpoint<
    RequestPut<`/lesson-update/${string}`, LessonUpdates>,
    StatusResponse
  >;
  lessons: Endpoint<RequestPost<'/lessons', LessonsRequest>, LessonsResponse>;
  myLessons: Endpoint<
    RequestPost<'/my-lessons', MyLessonsRequest>,
    LessonsResponse
  >;
  // Activity endpoints
  activity: Endpoint<RequestGet<`/activity/${string}`>, ActivityResponse>;
  activityDelete: Endpoint<
    RequestDelete<`/activity/${string}`>,
    StatusResponse
  >;
  activitySave: Endpoint<
    RequestPost<'/activity/save', Activity>,
    StatusResponse
  >;
  activityUpdate: Endpoint<
    RequestPost<`/activity-update/${string}`, SubjectPathUpdate[]>,
    StatusResponse
  >;
  activities: Endpoint<
    RequestPost<'/activities', ActivityFilters>,
    ActivitiesResponse
  >;
  scheduledTrainings: Endpoint<
    RequestPost<'/activities', ScheduledLessonActivityFilters>,
    ActivitiesResponse<LessonActivity>
  >;
  trainings: Endpoint<
    RequestPost<'/activities', LessonActivityFilters>,
    ActivitiesResponse<LessonActivity>
  >;
  // AWS - File endpoints
  uploadImage: Endpoint<RequestPut<string, File>, any>;
  signImageUrl: Endpoint<
    RequestPost<'/sign-image-url', { contentType: string; key: string }>,
    SignedImageResponse
  >;
  // Conversations endpoints
  conversations: Endpoint<
    RequestPost<'/conversations', { users: User['id'][] }>,
    ConversationsResponse
  >;
  messageSend: Endpoint<
    RequestPut<`/conversation/${string}/message`, Message>,
    StatusResponse
  >;
  conversationSave: Endpoint<
    RequestPost<'/conversation/save', Conversation>,
    StatusResponse
  >;
  conversation: Endpoint<
    RequestGet<`/conversation/${string}`>,
    ConversationResponse
  >;
  messages: Endpoint<
    RequestPost<
      `/conversation/${string}/messages`,
      { lastDocumentTimestamp: Pagination }
    >,
    ConversationMessagesResponse
  >;
  // Mentorship endpoints
  mentorshipRequest: Endpoint<
    RequestPost<'/mentorship', { studentId: User['id']; coachId: User['id'] }>,
    RequestMentorshipResponse
  >;
  mentorshipResolve: Endpoint<
    RequestPut<
      '/mentorship',
      { studentId: User['id']; coachId: User['id']; approved: boolean }
    >,
    StatusResponse
  >;
  coaches: Endpoint<
    RequestGet<`/mentorship/${string}/coaches`>,
    CoachesResponse
  >;
  students: Endpoint<
    RequestGet<`/mentorship/${string}/students`>,
    StudentsResponse
  >;
  // Notifications endpoints
  notifications: Endpoint<
    RequestGet<`/notifications?${string}`>,
    NotificationsResponse
  >;
  loadMoreNotifications: Endpoint<
    RequestGet<`/notifications?${string}`>,
    NotificationsResponse
  >;
  updateNotifications: Endpoint<
    RequestPut<'/notifications', UpdateNotificationsRequest>,
    StatusResponse
  >;
  // Tags endpoints
  findTags: Endpoint<RequestPost<'/tags', string>, TagsResponse>;
  tags: Endpoint<RequestGet<'/tags'>, TagsResponse>;
}
