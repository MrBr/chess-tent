import { User } from './user';
import { Lesson } from './lesson';
import { Step } from './step';
import { Activity } from './activity';
import { Conversation } from './conversation';
import { Chapter } from './chapter';
import { Message } from './message';
import { Tag } from './tag';
import { Analysis } from './analysis';
import { Notification } from './notification';
import { Mentorship } from './mentorship';
import { LessonDetails } from './lessonDetails';

export * from './analysis';
export * from './notification';
export * from './subject';
export * from './conversation';
export * from './message';
export * from './activity';
export * from './step';
export * from './lesson';
export * from './lessonDetails';
export * from './user';
export * from './chapter';
export * from './mentorship';
export * from './tag';

export type Entity =
  | User
  | Lesson
  | LessonDetails
  | Step
  | Activity
  | Conversation
  | Chapter
  | Message
  | Tag
  | Analysis<any> // :o
  | Notification
  | Mentorship;
