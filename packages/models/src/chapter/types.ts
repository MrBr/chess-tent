import { Subject } from "../subject";
import { Step } from "../step";

export const TYPE_CHAPTER = "chapters";

export interface Chapter extends Subject {
  id: string;
  type: typeof TYPE_CHAPTER;
  state: {
    title: string;
    steps: Step[];
    description?: string;
  };
}

export interface NormalizedChapter {
  id: Chapter["id"];
  type: Chapter["type"];
  state: {
    title: Chapter["state"]["title"];
    steps: Step["id"][];
    description?: Chapter["state"]["description"];
  };
}
