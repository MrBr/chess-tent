import { Step, User } from '@chess-tent/models';
import { DepopulatedStep, StepModel } from './model';
import { AppDocument } from '@types';
import { LessonModel } from '../lesson/model';
import { service } from '@application';

export const saveStep = (
  step: Step,
  depopulate = 'owner tags users',
) =>
  new Promise<void>(resolve => {
    StepModel.updateOne({ _id: step.id }, () => {
      let transformed = step as unknown as AppDocument<DepopulatedStep>;
      return transformed.depopulate(depopulate);
    }, {
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
    StepModel.findById(stepId)
      .populate(populate)
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject<Step>() : null);
      });
  });

export const deleteStep = async (stepId: Step['id']) => {
  await StepModel.deleteOne({ _id: stepId });
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
