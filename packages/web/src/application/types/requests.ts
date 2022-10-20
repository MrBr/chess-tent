import {
  Endpoints,
  GetEndpointData,
  InviteUserParams,
  LessonActivityFilters,
  LessonUpdates,
  Pagination,
  PaginationBucket,
  RegisterRequestParams,
  RequestFetch,
  ScheduledLessonActivityFilters,
} from '@chess-tent/types';
import {
  Activity,
  Conversation,
  Lesson,
  SubjectPathUpdate,
  User,
} from '@chess-tent/models';

// Client implementation interfaces
export interface Requests {
  register: RequestFetch<Endpoints['register'], RegisterRequestParams>;
  forgotPassword: RequestFetch<Endpoints['forgotPassword']>;
  resetPassword: RequestFetch<Endpoints['resetPassword']>;
  inviteUser: RequestFetch<Endpoints['inviteUser'], InviteUserParams>;
  login: RequestFetch<Endpoints['login'], Pick<User, 'email' | 'password'>>;
  logout: RequestFetch<Endpoints['logout']>;
  me: RequestFetch<Endpoints['me']>;
  coaches: RequestFetch<
    Endpoints['coaches'],
    [GetEndpointData<Endpoints['coaches']>, Pagination?]
  >;
  user: RequestFetch<Endpoints['user'], User['id']>;
  userValidate: RequestFetch<Endpoints['userValidate'], Partial<User>>;
  updateMe: RequestFetch<Endpoints['updateMe']>;

  lesson: RequestFetch<Endpoints['lesson'], Lesson['id']>;
  lessonChapters: RequestFetch<
    Endpoints['lessonChapters'],
    [Lesson['id'], string[]]
  >;
  lessonDelete: RequestFetch<Endpoints['lessonDelete'], Lesson['id']>;
  lessonSave: RequestFetch<Endpoints['lessonSave']>;
  lessonPublish: RequestFetch<Endpoints['lessonPublish'], [Lesson['id']]>;
  lessonUnpublish: RequestFetch<Endpoints['lessonUnpublish'], [Lesson['id']]>;
  lessonPatch: RequestFetch<
    Endpoints['lessonPatch'],
    [Lesson['id'], Partial<Lesson>]
  >;
  lessonUpdates: RequestFetch<
    Endpoints['lessonUpdates'],
    [Lesson['id'], LessonUpdates]
  >;
  lessons: RequestFetch<
    Endpoints['lessons'],
    [GetEndpointData<Endpoints['lessons']>, Pagination?]
  >;
  myLessons: RequestFetch<
    Endpoints['myLessons'],
    [GetEndpointData<Endpoints['myLessons']>, Pagination?]
  >;

  activity: RequestFetch<Endpoints['activity'], Activity['id']>;
  activityPatch: RequestFetch<
    Endpoints['activityPatch'],
    [Activity['id'], Partial<Activity>]
  >;
  activityDelete: RequestFetch<Endpoints['activityDelete'], Activity['id']>;
  activitySave: RequestFetch<Endpoints['activitySave']>;
  activityUpdate: RequestFetch<
    Endpoints['activityUpdate'],
    [Activity['id'], SubjectPathUpdate[]]
  >;
  activities: RequestFetch<
    Endpoints['activities'],
    [GetEndpointData<Endpoints['activities']>, Pagination?]
  >;
  scheduledTrainings: RequestFetch<
    Endpoints['trainings'],
    Omit<ScheduledLessonActivityFilters, 'subjectType'>
  >;
  trainings: RequestFetch<
    Endpoints['trainings'],
    Omit<LessonActivityFilters, 'subjectType'>
  >;

  uploadImage: RequestFetch<Endpoints['uploadImage'], [string, File]>;
  signImageUrl: RequestFetch<Endpoints['signImageUrl']>;

  contacts: RequestFetch<Endpoints['contacts'], [Pagination]>;
  conversations: RequestFetch<
    Endpoints['conversations'],
    [User['id'][] | User['id'], Pagination]
  >;
  conversationSave: RequestFetch<Endpoints['conversationSave']>;
  conversation: RequestFetch<Endpoints['conversation'], Conversation['id']>;
  messages: RequestFetch<
    Endpoints['messages'],
    [Conversation['id'], PaginationBucket]
  >;

  mentorshipRequest: RequestFetch<Endpoints['mentorshipRequest']>;
  mentorshipResolve: RequestFetch<Endpoints['mentorshipResolve']>;
  myCoaches: RequestFetch<Endpoints['myCoaches']>;
  myStudents: RequestFetch<Endpoints['myStudents']>;

  notifications: RequestFetch<
    Endpoints['notifications'],
    [boolean?, PaginationBucket?]
  >;
  loadMoreNotifications: RequestFetch<
    Endpoints['loadMoreNotifications'],
    [PaginationBucket?]
  >;
  updateNotifications: RequestFetch<Endpoints['updateNotifications']>;

  findTags: RequestFetch<Endpoints['findTags']>;
  tags: RequestFetch<Endpoints['tags']>;
}
