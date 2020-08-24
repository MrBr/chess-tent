import { Activity, Lesson, User } from '@chess-tent/models';
import { GenericArguments } from './_helpers';

export type StatusResponse = { error: string | null };
export type DataResponse<T> = { data: T } & StatusResponse;
export type UserResponse = DataResponse<User>;
export type LessonResponse = DataResponse<Lesson>;
export type LessonsResponse = DataResponse<Lesson[]>;
export type ActivityResponse = DataResponse<Activity>;
export type ActivitiesResponse = DataResponse<Activity[]>;

export type ApiMethods = 'GET' | 'POST';
export interface API {
  basePath: string;
  makeRequest: <T, U>(request: {
    url: string;
    method: ApiMethods;
    data?: T;
  }) => Promise<U>;
}

export interface Request<T> {
  url: string;
  method: ApiMethods;
  data?: T;
}
export type RequestFetch<T, U> = (...args: GenericArguments<T>) => Promise<U>;

export type Requests = {
  register: RequestFetch<Partial<User>, StatusResponse>;
  login: RequestFetch<Pick<User, 'email' | 'password'>, UserResponse>;
  me: RequestFetch<undefined, UserResponse>;
  lesson: RequestFetch<[string], LessonResponse>;
  lessonSave: RequestFetch<Lesson, StatusResponse>;
  lessons: RequestFetch<{ owner: User['id'] }, LessonsResponse>;
  activity: RequestFetch<[string], ActivityResponse>;
  activitySave: RequestFetch<Activity, StatusResponse>;
  activities: RequestFetch<{ owner: User['id'] }, ActivitiesResponse>;
};
