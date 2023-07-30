import { Step, User } from '@chess-tent/models';
import { SubjectFilters } from '@chess-tent/types';

export const saveStep = (step: Step) =>
  new Promise<void>(resolve => {
    StepModel.updateOne({ _id: step.id }, depopulate(step), {
      upsert: true,
    }).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const getStep = (
  stepId: Step['id'],
  populate = 'owner tags users',
): Promise<Step | null> =>
  new Promise(resolve => {
    // todo
    throw new Error('not implemented');
  });

export const deleteStep = async (stepId: Step['id']) => {
  // todo
  throw new Error('not implemented');
};

export const publishStep = (stepId: Step['id']) =>
  new Promise<void>(async resolve => {
    // todo
    throw new Error('not implemented');
  });

export const unpublishStep = (stepId: Step['id']) =>
  new Promise<void>(resolve => {
    // todo
    throw new Error('not implemented');
  });

export const patchStep = (stepId: Step['id'], step: Partial<Step>) =>
  new Promise<void>(resolve => {
    // todo
    throw new Error('not implemented');
  });

export const findSteps = (filters: Partial<SubjectFilters>): Promise<Step[]> =>
  new Promise(resolve => {
    // todo
    throw new Error('not implemented');
  });

export const canEditStep = (stepId: Step['id'], userId: User['id']) =>
  new Promise((resolve, reject) => {
    // todo
    throw new Error('not implemented');
  });

export const canAccessStep = (stepId: Step['id'], userId: User['id']) =>
  new Promise((resolve, reject) => {
    // todo
    throw new Error('not implemented');
  });
