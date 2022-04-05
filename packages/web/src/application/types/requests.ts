import {
  Endpoints,
  InviteUserParams,
  LessonActivityFilters,
  LessonUpdates,
  Pagination,
  RegisterRequestParams,
  RequestFetch,
} from '@chess-tent/types';
import {
  Activity,
  Conversation,
  Lesson,
  Message,
  SubjectPathUpdate,
  User,
} from '@chess-tent/models';

// Client implementation interfaces
export interface Requests {
  register: RequestFetch<Endpoints['register'], RegisterRequestParams>;
  inviteUser: RequestFetch<Endpoints['inviteUser'], InviteUserParams>;
  login: RequestFetch<Endpoints['login'], Pick<User, 'email' | 'password'>>;
  logout: RequestFetch<Endpoints['logout']>;
  me: RequestFetch<Endpoints['me']>;
  users: RequestFetch<Endpoints['users']>;
  user: RequestFetch<Endpoints['user'], User['id']>;
  updateMe: RequestFetch<Endpoints['updateMe']>;

  lesson: RequestFetch<Endpoints['lesson'], Lesson['id']>;
  lessonSave: RequestFetch<Endpoints['lessonSave']>;
  lessonPublish: RequestFetch<Endpoints['lessonPublish']>;
  lessonUnpublish: RequestFetch<Endpoints['lessonUnpublish']>;
  lessonPatch: RequestFetch<
    Endpoints['lessonPatch'],
    [Lesson['id'], Partial<Lesson>]
  >;
  lessonUpdates: RequestFetch<
    Endpoints['lessonUpdates'],
    [Lesson['id'], LessonUpdates]
  >;
  lessons: RequestFetch<Endpoints['lessons']>;
  myLessons: RequestFetch<Endpoints['myLessons']>;

  activity: RequestFetch<Endpoints['activity'], Activity['id']>;
  activitySave: RequestFetch<Endpoints['activitySave']>;
  activityUpdate: RequestFetch<
    Endpoints['activityUpdate'],
    [Activity['id'], SubjectPathUpdate[]]
  >;
  activities: RequestFetch<Endpoints['activities']>;
  trainings: RequestFetch<
    Endpoints['trainings'],
    Omit<LessonActivityFilters, 'subjectType'>
  >;

  uploadImage: RequestFetch<Endpoints['uploadImage'], [string, File]>;
  signImageUrl: RequestFetch<Endpoints['signImageUrl']>;

  conversations: RequestFetch<
    Endpoints['conversations'],
    User['id'][] | User['id']
  >;
  messageSend: RequestFetch<
    Endpoints['messageSend'],
    [Conversation['id'], Message]
  >;
  conversationSave: RequestFetch<Endpoints['conversationSave']>;
  conversation: RequestFetch<Endpoints['conversation'], Conversation['id']>;
  messages: RequestFetch<
    Endpoints['messages'],
    [Conversation['id'], Pagination]
  >;

  mentorshipRequest: RequestFetch<Endpoints['mentorshipRequest']>;
  mentorshipResolve: RequestFetch<Endpoints['mentorshipResolve']>;
  coaches: RequestFetch<Endpoints['coaches'], User>;
  students: RequestFetch<Endpoints['students'], User>;

  notifications: RequestFetch<
    Endpoints['notifications'],
    [boolean?, Pagination?]
  >;
  loadMoreNotifications: RequestFetch<
    Endpoints['loadMoreNotifications'],
    [Pagination?]
  >;
  updateNotifications: RequestFetch<Endpoints['updateNotifications']>;

  findTags: RequestFetch<Endpoints['findTags']>;
  tags: RequestFetch<Endpoints['tags']>;
}
