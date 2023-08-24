import { NormalizedUser, User } from './user';
import { Lesson, NormalizedLesson } from './lesson';
import { NormalizedStep, Step } from './step';
import { Activity, NormalizedActivity } from './activity';
import { Conversation, NormalizedConversation } from './conversation';
import { Chapter, NormalizedChapter } from './chapter';
import { Message, NormalizedMessage } from './message';
import { NormalizedTag, Tag } from './tag';
import { Analysis, NormalizedAnalysis } from './analysis';
import { NormalizedNotification, Notification } from './notification';
import { Mentorship, NormalizedMentorship } from './mentorship';
import { ZoomUserToken, NormalizedZoomUserToken } from './zoom';

export * from './analysis';
export * from './notification';
export * from './subject';
export * from './conversation';
export * from './message';
export * from './activity';
export * from './step';
export * from './lesson';
export * from './user';
export * from './chapter';
export * from './mentorship';
export * from './tag';
export * from './role';
export * from './zoom';

export * from './_helpers';

export type Entity =
  | User
  | Lesson
  | Step
  | Activity
  | Conversation
  | Chapter
  | Message
  | Tag
  | Analysis<any> // :o
  | Notification
  | Mentorship
  | ZoomUserToken;

export type NormalizedEntity =
  | NormalizedUser
  | NormalizedLesson
  | NormalizedStep
  | NormalizedActivity
  | NormalizedConversation
  | NormalizedChapter
  | NormalizedMessage
  | NormalizedTag
  | NormalizedAnalysis<any> // :o
  | NormalizedNotification
  | NormalizedMentorship
  | NormalizedZoomUserToken;
