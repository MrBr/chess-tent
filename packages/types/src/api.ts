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
  LessonActivity,
} from '@chess-tent/models';
import { GenericArguments } from './_helpers';
import { LessonAction } from './actions';

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

export type StatusResponse = { error: string | null };
export type SignedImageResponse = { data: string } & StatusResponse;
export type DataResponse<T> = { data: T } & StatusResponse;
export type UserResponse = DataResponse<User>;
export type UsersResponse = DataResponse<User[]>;
export type LessonResponse = DataResponse<Lesson>;
export type LessonsResponse = DataResponse<Lesson[]>;
export type ActivityResponse = DataResponse<Activity>;
export type ActivitiesResponse<T extends Activity = Activity> = DataResponse<
  T[]
>;
export type ConversationsResponse = DataResponse<Conversation[]>;
export type ConversationResponse = DataResponse<Conversation>;
export type ConversationMessagesResponse = DataResponse<NormalizedMessage[]>;
export type CoachesResponse = DataResponse<Mentorship[]>;
export type RequestMentorshipResponse = DataResponse<NormalizedMentorship>;
export type StudentsResponse = DataResponse<Mentorship[]>;
export type NotificationsResponse = DataResponse<Notification[]>;
export type TagsResponse = DataResponse<Tag[]>;

export type ActivityFilters = {
  owner?: User['id'];
  users?: User['id'] | User['id'][];
  subject?: Lesson['id'];
  state?: {};
};

export type ApiMethods = 'GET' | 'POST' | 'PUT';
export interface Request<T> {
  url: string;
  method: ApiMethods;
  data?: T;
  headers?: {};
}

export interface API {
  basePath: string;
  makeRequest: <T, U>(request: Request<T>) => Promise<U>;
}

export type RequestFetch<T, U> = (...args: GenericArguments<T>) => Promise<U>;
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

export type Requests = {
  register: RequestFetch<RegisterRequestParams, UserResponse>;
  inviteUser: RequestFetch<InviteUserParams, StatusResponse>;
  login: RequestFetch<Pick<User, 'email' | 'password'>, UserResponse>;
  logout: RequestFetch<undefined, StatusResponse>;
  me: RequestFetch<undefined, UserResponse>;
  users: RequestFetch<
    {
      coach?: boolean;
      name?: string;
      search?: string;
      studentElo?: CoachEloRange;
      tagIds?: Tag['id'][];
    },
    UsersResponse
  >;
  user: RequestFetch<User['id'], UserResponse>;
  updateMe: RequestFetch<Partial<User>, UserResponse>;
  lesson: RequestFetch<[string], LessonResponse>;
  lessonSave: RequestFetch<Lesson, StatusResponse>;
  lessonPublish: RequestFetch<[Lesson['id'], Lesson], StatusResponse>;
  lessonPatch: RequestFetch<[Lesson['id'], Partial<Lesson>], StatusResponse>;
  lessonUpdates: RequestFetch<[Lesson['id'], LessonUpdates], StatusResponse>;
  lessons: RequestFetch<LessonsRequest, LessonsResponse>;
  myLessons: RequestFetch<MyLessonsRequest, LessonsResponse>;
  activity: RequestFetch<[string], ActivityResponse>;
  activitySave: RequestFetch<Activity, StatusResponse>;
  activityUpdate: RequestFetch<
    [Activity['id'], SubjectPathUpdate[]],
    StatusResponse
  >;
  activities: RequestFetch<ActivityFilters, ActivitiesResponse>;
  trainings: RequestFetch<ActivityFilters, ActivitiesResponse<LessonActivity>>;
  uploadImage: RequestFetch<[string, File], any>;
  signImageUrl: RequestFetch<
    { contentType: string; key: string },
    SignedImageResponse
  >;
  conversations: RequestFetch<User['id'][] | User['id'], ConversationsResponse>;
  messageSend: RequestFetch<[Conversation['id'], Message], StatusResponse>;
  conversationSave: RequestFetch<Conversation, StatusResponse>;
  conversation: RequestFetch<Conversation['id'], ConversationResponse>;
  messages: RequestFetch<
    [Conversation['id'], Pagination],
    ConversationMessagesResponse
  >;
  mentorshipRequest: RequestFetch<
    { studentId: User['id']; coachId: User['id'] },
    RequestMentorshipResponse
  >;
  mentorshipResolve: RequestFetch<
    { studentId: User['id']; coachId: User['id']; approved: boolean },
    StatusResponse
  >;
  coaches: RequestFetch<User, CoachesResponse>;
  notifications: RequestFetch<boolean | undefined, NotificationsResponse>;
  loadMoreNotifications: RequestFetch<Pagination, NotificationsResponse>;
  updateNotifications: RequestFetch<UpdateNotificationsRequest, StatusResponse>;
  students: RequestFetch<User, StudentsResponse>;
  findTags: RequestFetch<string, TagsResponse>;
  tags: RequestFetch<undefined, TagsResponse>;
};
