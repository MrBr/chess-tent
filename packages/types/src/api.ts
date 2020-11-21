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
  Speciality,
  CoachEloRange,
  Mentorship,
  NormalizedMentorship,
  Notification
} from "@chess-tent/models";
import { GenericArguments } from "./_helpers";
import {
  AddLessonChapterAction,
  UpdateLessonChapterAction,
  UpdateLessonPathAction,
  UpdateLessonStepAction,
} from "./actions";

export type Pagination = [number, number];

export type StatusResponse = { error: string | null };
export type SignedImageResponse = { data: string } & StatusResponse;
export type DataResponse<T> = { data: T } & StatusResponse;
export type UserResponse = DataResponse<User>;
export type UsersResponse = DataResponse<User[]>;
export type LessonResponse = DataResponse<Lesson>;
export type LessonsResponse = DataResponse<Lesson[]>;
export type ActivityResponse = DataResponse<Activity>;
export type ActivitiesResponse = DataResponse<Activity[]>;
export type ConversationsResponse = DataResponse<Conversation[]>;
export type ConversationResponse = DataResponse<Conversation>;
export type ConversationMessagesResponse = DataResponse<NormalizedMessage[]>;
export type CoachesResponse = DataResponse<Mentorship[]>;
export type RequestMentorshipResponse = DataResponse<NormalizedMentorship>;
export type StudentsResponse = DataResponse<Mentorship[]>;
export type NotificationsResponse = DataResponse<Notification[]>;
export type TagsResponse = DataResponse<Tag[]>;

export type ActivityFilters = {
  owner?: User["id"];
  users?: User["id"] | User["id"][];
  subject?: Lesson["id"];
  state?: {};
};

export type ApiMethods = "GET" | "POST" | "PUT";
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
export type LessonUpdatableAction =
  | UpdateLessonStepAction
  | UpdateLessonChapterAction
  | AddLessonChapterAction
  | UpdateLessonPathAction;
export type LessonUpdates = { path: SubjectPath; value: any }[];

export type Requests = {
  register: RequestFetch<Partial<User>, StatusResponse>;
  login: RequestFetch<Pick<User, "email" | "password">, UserResponse>;
  logout: RequestFetch<undefined, StatusResponse>;
  me: RequestFetch<undefined, UserResponse>;
  users: RequestFetch<
    {
      coach?: boolean;
      name?: string;
      search?: string;
      elo?: CoachEloRange;
      speciality?: Speciality;
    },
    UsersResponse
  >;
  user: RequestFetch<User["id"], UserResponse>;
  updateMe: RequestFetch<Partial<User>, UserResponse>;
  lesson: RequestFetch<[string], LessonResponse>;
  lessonSave: RequestFetch<Lesson, StatusResponse>;
  lessonPatch: RequestFetch<[Lesson["id"], Partial<Lesson>], StatusResponse>;
  lessonUpdates: RequestFetch<[Lesson["id"], LessonUpdates], StatusResponse>;
  lessons: RequestFetch<{ owner: User["id"] }, LessonsResponse>;
  activity: RequestFetch<[string], ActivityResponse>;
  activitySave: RequestFetch<Activity, StatusResponse>;
  activities: RequestFetch<ActivityFilters, ActivitiesResponse>;
  uploadImage: RequestFetch<[string, File], any>;
  signImageUrl: RequestFetch<
    { contentType: string; key: string },
    SignedImageResponse
  >;
  conversations: RequestFetch<User["id"][] | User["id"], ConversationsResponse>;
  messageSend: RequestFetch<[Conversation["id"], Message], StatusResponse>;
  conversationSave: RequestFetch<Conversation, StatusResponse>;
  conversation: RequestFetch<Conversation["id"], ConversationResponse>;
  messages: RequestFetch<
    [Conversation["id"], Pagination],
    ConversationMessagesResponse
  >;
  mentorshipRequest: RequestFetch<
    { studentId: User["id"]; coachId: User["id"] },
    RequestMentorshipResponse
  >;
  mentorshipResolve: RequestFetch<
    { studentId: User["id"]; coachId: User["id"]; approved: boolean },
    StatusResponse
  >;
  coaches: RequestFetch<User, CoachesResponse>;
  notifications: RequestFetch<boolean | undefined, NotificationsResponse>;
  students: RequestFetch<User, StudentsResponse>;
  findTags: RequestFetch<string, TagsResponse>;
  tags: RequestFetch<undefined, TagsResponse>;
};
