import { SubjectPath, Subject } from './types';

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

export const updateSubjectValueAt = <
  T extends { [key: string]: any } | Array<any>
>(
  subject: T | undefined,
  valuePath: SubjectPath,
  value: any,
): T => {
  const [key, ...nestedPath] = valuePath;
  const shouldBeArray =
    Array.isArray(subject) ||
    (subject === undefined && typeof key === 'number');
  let updatedSubject;
  if (shouldBeArray) {
    const index = typeof key === 'number' ? key : parseInt(key);
    updatedSubject = [...((subject as Array<any>) || [])];
    updatedSubject[index] =
      nestedPath.length === 0
        ? value
        : updateSubjectValueAt(updatedSubject[index], nestedPath, value);
  } else {
    const propName = key + '';
    updatedSubject = { ...(subject || {}) } as { [key: string]: any };
    updatedSubject[propName] =
      nestedPath.length === 0
        ? value
        : updateSubjectValueAt(updatedSubject[propName], nestedPath, value);
  }

  return updatedSubject as T;
};

export const getDiff = (
  oldSubject: {} | unknown[],
  newSubject: {} | unknown[],
  result: { [key: string]: unknown },
  path = '',
): { [key: string]: unknown } => {
  for (const key in newSubject) {
    const newValue = newSubject?.[key as keyof typeof newSubject];
    const oldValue = oldSubject?.[key as keyof typeof newSubject];

    const newPath = path + key;
    if (
      (Array.isArray(newValue) && !Array.isArray(oldValue)) ||
      (typeof newValue === 'object' &&
        (typeof oldValue === 'object' || Array.isArray(oldValue)))
    ) {
      getDiff(oldValue, newValue, result, newPath + '.');
    } else if (newValue !== oldValue) {
      result[newPath] = newValue;
    }
  }
  return result;
};
