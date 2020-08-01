import { User } from "../user";
import { Subject } from "../subject";
import { Step } from "../step";

export const TYPE_LESSON = "lessons";

export interface Lesson extends Subject {
  id: string;
  owner: User;
  type: typeof TYPE_LESSON;
  state: {
    activeStep: Step;
    steps: Step[];
  };
}

export interface NormalizedLesson {
  id: Lesson["id"];
  type: Lesson["type"];
  owner: User["id"];
  state: {
    activeStep: Step["id"];
    steps: Step["id"][];
  };
}
