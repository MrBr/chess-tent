import { Subject } from "./types";

export const updateSubjectState = <T extends Subject>(
  lesson: T,
  patch: Partial<T["state"]>
): T => ({
  ...lesson,
  state: {
    ...lesson.state,
    ...patch
  }
});
