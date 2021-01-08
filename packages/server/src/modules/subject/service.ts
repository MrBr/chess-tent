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
