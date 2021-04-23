import {
  SubjectPath,
  VersionPath,
  getSubjectWithVersion,
} from '@chess-tent/models';
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

export const transformSubjectVersion = (
  subjectPath: SubjectPath,
  versionPath: VersionPath,
): any => {
  return (document: any) => {
    const subjectMongoosePath = subjectPathToMongoosePath(subjectPath);
    const versionMongoosePath = subjectPathToMongoosePath(versionPath);
    return {
      ...document,
      [subjectMongoosePath]: getSubjectWithVersion(
        document[subjectMongoosePath],
        document[versionMongoosePath],
      ),
    };
  };
};
