import { User } from "../user";
import { Subject } from "../subject";
import { Chapter } from "../chapter";

export const TYPE_LESSON = "lessons";

export interface Lesson extends Subject {
  id: string;
  owner: User;
  type: typeof TYPE_LESSON;
  state: {
    chapters: Chapter[];
    title: string;
    description?: string;
  };
}

export interface NormalizedLesson {
  id: Lesson["id"];
  type: Lesson["type"];
  owner: User["id"];
  state: {
    chapters: Chapter[];
    title: Lesson["state"]["title"];
    description?: Lesson["state"]["description"];
  };
}
