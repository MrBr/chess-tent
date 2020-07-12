import { Subject } from "./types";

export const updateSubjectState = <T extends Subject>(
  subject: T,
  patch: T extends { state: infer U } ? Partial<U> : never
): T => ({
  ...subject,
  state: {
    ...subject.state,
    ...patch
  }
});
