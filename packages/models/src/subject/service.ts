import { SubjectPath, Subject } from "./types";

export const updateSubjectState = <T extends Subject>(
  subject: T,
  patch: T extends { state: infer U } ? Partial<U> : never
): T => ({
  ...subject,
  state: {
    ...subject.state,
    ...patch,
  },
});

export const getSubjectValueAt = <T extends Subject>(
  subject: T,
  valuePath: SubjectPath
) => {
  let value = subject;
  for (const path of valuePath) {
    // @ts-ignore
    value = value[path];
  }
  return value;
};

export const updateSubjectValueAt = <T extends Subject | Subject[]>(
  subject: T,
  valuePath: SubjectPath,
  value: any
): T => {
  const [key, ...nestedPath] = valuePath;
  const updatedSubject = (Array.isArray(subject)
    ? [...subject]
    : { ...subject }) as T;
  // @ts-ignore
  updatedSubject[key] =
    nestedPath.length === 0
      ? value
      : // @ts-ignore
        updateSubjectValueAt(updatedSubject[key], nestedPath, value);
  return updatedSubject;
};
