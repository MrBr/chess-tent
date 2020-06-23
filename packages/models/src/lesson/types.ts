import { Section } from "../section";
import { Step } from "../step";
import { Subject } from "../subject";
import { User } from "../user";

export const TYPE_LESSON = "lessons";

export interface Lesson extends Subject {
  id: string;
  state: {
    section: Section;
    activeStep: Step;
    owner: User;
  };
  type: typeof TYPE_LESSON;
}

export interface NormalizedLesson {
  id: Lesson["id"];
  type: Lesson["type"];
  state: {
    activeStep: Step["id"];
    section: Section["id"];
    owner: User["id"];
  };
}
