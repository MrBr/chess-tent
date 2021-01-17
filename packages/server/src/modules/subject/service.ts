import { SubjectPath } from '@chess-tent/models';
import { Service } from '@types';

export const subjectPathToMongoosePath = (path: SubjectPath) => {
  return path.join('.');
};

export const subjectPathUpdatesToMongoose$set: Service['subjectPathUpdatesToMongoose$set'] = updates => {
  return updates.reduce<Record<string, any>>((result, update) => {
    const path = subjectPathToMongoosePath(update.path);
    result[path] = update.value;
    return result;
  }, {});
};

export const flattenStateToMongoose$set: Service['flattenStateToMongoose$set'] = subject => {
  if (subject.state) {
    const flattenedSubject = {
      ...subject,
      ...Object.keys(subject.state).reduce((res, key) => {
        res[`state.${key}`] = subject.state?.[key];
        return res;
      }, {} as Record<string, any>),
    };
    delete flattenedSubject.state;
    return flattenedSubject;
  }
  return subject;
};

export const getDiff: Service['getDiff'] = (
  oldSubject,
  newSubject,
  result,
  path = '',
) => {
  for (const key in newSubject) {
    const newValue = newSubject[key];
    const oldValue = oldSubject[key];
    const newPath = path + key;
    if (
      (Array.isArray(newValue) && !Array.isArray(oldValue)) ||
      typeof newValue === 'object' ||
      typeof oldValue === 'object' ||
      Array.isArray(oldValue)
    ) {
      //@ts-ignore
      getDiff(oldValue, newValue, result, newPath + '.');
    } else if (newValue !== oldValue) {
      result[newPath] = newValue;
    }
  }
  return result;
};
