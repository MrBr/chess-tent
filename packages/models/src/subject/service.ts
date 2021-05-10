import merge from 'lodash.mergewith';
import { Subject, SubjectPath } from './types';
import { createService } from '../_helpers';

export const updateSubject = createService(
  <T extends Subject>(draft: T, patch: Partial<T>): T => {
    merge(draft, patch);
    return draft;
  },
);

export const updateSubjectState = createService(
  <T extends Subject>(
    draft: T,
    patch: T extends { state: infer U } ? Partial<U> : never,
  ): T => {
    merge(draft.state, patch);
    return draft;
  },
);

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
