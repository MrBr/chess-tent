import { Subject } from "./types";

export const updateSubjectState = <T extends Subject>(
  subject: T,
  patch: Partial<T["state"]>
): T => ({
  ...subject,
  state: {
    ...subject.state,
    ...patch
  }
});
