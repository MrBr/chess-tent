import { User } from "../user";
import { Subject } from "../subject";
import { Chapter } from "../chapter/types";

export const TYPE_LESSON = "lessons";

export interface Lesson extends Subject {
  id: string;
  owner: User;
  type: typeof TYPE_LESSON;
  state: {
    chapters: Chapter[];
  };
}

export interface NormalizedLesson {
  id: Lesson["id"];
  type: Lesson["type"];
  owner: User["id"];
  state: {
    chapters: Chapter["id"][];
  };
}
