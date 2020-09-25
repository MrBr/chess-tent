import { User } from "./user/types";
import { Lesson } from "./lesson/types";
import { Step } from "./step/types";
import { Activity } from "./activity/types";
import { Conversation } from "./conversation/types";
import { Chapter } from "./chapter/types";
import { Message } from "./message";

export * from "./subject";
export * from "./conversation";
export * from "./message";
export * from "./activity";
export * from "./step";
export * from "./lesson";
export * from "./user";
export * from "./chapter";

export type Entity =
  | User
  | Lesson
  | Step
  | Activity
  | Conversation
  | Chapter
  | Message;
