import { SubjectPath } from '@chess-tent/models';
import { Service } from '@types';
import pickBy from 'lodash/pickBy';

export const subjectPathToMongoosePath = (path: SubjectPath) => {
  return path.join('.');
};

export const subjectPathUpdatesToMongoose: Service['subjectPathUpdatesToMongoose'] = updates => {
  const original$Set = updates.reduce<Record<string, any>>((result, update) => {
    const path = subjectPathToMongoosePath(update.path);
    result[path] = update.value;
    return result;
  }, {});
  const $set = pickBy(original$Set, value => value !== undefined);
  const $unset = pickBy(original$Set, value => value === undefined);
  return { $set, $unset };
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
