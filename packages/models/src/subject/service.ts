import { Subject, SubjectPath } from './types';

export const updateSubject = <T extends Subject>(
  subject: T,
  patch: Partial<T>,
): T => ({
  ...subject,
  ...patch,
});

export const updateSubjectState = <T extends Subject>(
  subject: T,
  patch: T extends { state: infer U } ? Partial<U> : never,
): T => ({
  ...subject,
  state: {
    ...subject.state,
    ...patch,
  },
});

export const getSubjectValueAt = <T extends Subject>(
  subject: T,
  valuePath: SubjectPath,
) => {
  let value = subject;
  for (const path of valuePath) {
    // @ts-ignore
    value = value[path];
  }
  return value;
};
