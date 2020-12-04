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

export const updateSubjectValueAt = <
  T extends { [key: string]: any } | Array<any>
>(
  subject: T,
  valuePath: SubjectPath,
  value: any
): T => {
  const [key, ...nestedPath] = valuePath;
  let updatedSubject;
  if (Array.isArray(subject)) {
    const index = typeof key === "number" ? key : parseInt(key);
    updatedSubject = [...subject];
    updatedSubject[index] =
      nestedPath.length === 0
        ? value
        : updateSubjectValueAt(updatedSubject[index], nestedPath, value);
  } else {
    const propName = key + "";
    updatedSubject = { ...subject } as { [key: string]: any };
    updatedSubject[propName] =
      nestedPath.length === 0
        ? value
        : updateSubjectValueAt(updatedSubject[propName], nestedPath, value);
  }

  return updatedSubject as T;
};
