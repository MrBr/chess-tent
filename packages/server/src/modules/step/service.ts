import { Step, User } from '@chess-tent/models';
import { DepopulatedStep, StepModel } from './model';
import { AppDocument } from '@types';
import { db, service, utils } from '@application';
import { SubjectFilters } from '@chess-tent/types';
import { FilterQuery } from 'mongoose';
import _ from 'lodash';
import { canAccessStepCheck, canEditStepCheck } from '@chess-tent/models/src';

const depopulateStep = (
  step: Partial<Step>,
  depopulate = 'owner tags users'
) => {
  let transformed = step as unknown as AppDocument<DepopulatedStep>;
  return transformed.depopulate(depopulate);
}

export const saveStep = (
  step: Step,
) =>
  new Promise<void>(resolve => {
    StepModel.updateOne({ _id: step.id }, depopulateStep(step), {
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
    const step = await getStep(stepId, '');
    if (!step) {
      throw new Error('Publishing non-existing step.');
    }
    StepModel.bulkWrite(
      [
        {
          updateOne: {
            filter: { docId: stepId },
            update: {
              $setOnInsert: { _id: service.generateIndex() },
              $set: {
                published: true,
                docId: stepId,
              },
            },
            upsert: true,
          },
        },
        {
          updateOne: {
            filter: { _id: stepId },
            update: {
              $set: {
                published: true,
              },
            },
          },
        },
      ],
      {},
      err => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const unpublishStep = (stepId: Step['id']) =>
  new Promise<void>(resolve => {
    StepModel.bulkWrite(
      [
        {
          updateOne: {
            filter: { docId: stepId },
            update: {
              $set: {
                published: false,
              },
            },
          },
        },
        {
          updateOne: {
            filter: { _id: stepId },
            update: {
              $set: {
                published: false,
              },
            },
          },
        },
      ],
      {},
      err => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const patchStep = (stepId: Step['id'], step: Partial<Step>) =>
  new Promise<void>(resolve => {
    StepModel.updateOne({ _id: stepId }, { $set: depopulateStep(step) }).exec(
      err => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const findSteps = (filters: Partial<SubjectFilters>): Promise<Step[]> =>
  new Promise(resolve => {
    const owner = utils.notNullOrUndefined({
      owner: filters.owner,
    });
    const users = db.allQuery('users', filters.users);
    const query: FilterQuery<AppDocument<DepopulatedStep>> =
      utils.notNullOrUndefined({
        published: filters.published,
        ...db.orQueries(owner, users),
      });

    if (filters.difficulty) {
      query['difficulty'] = { $eq: filters.difficulty };
    }

    if (!_.isEmpty(filters.tagIds)) {
      query['tags'] = { $in: filters.tagIds };
    }

    if (filters.search) {
      query['$text'] = { $search: filters.search, $caseSensitive: false };
    }

    if (filters.hasDocId === true) {
      query['docId'] = { $exists: true, $ne: undefined };
    }

    if (filters.hasDocId === false) {
      query['docId'] = { $not: { $exists: true, $ne: undefined } };
    }
    StepModel.find(query)
      .populate('owner tags users')
      .select('-state.chapters.state.steps.state.steps')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject<Step>()));
      });
  });

export const canEditStep = (stepId: Step['id'], userId: User['id']) =>
  new Promise((resolve, reject) => {
    getStep(stepId)
      .then(step => resolve(!step || canEditStepCheck(step, userId)))
      .catch(reject);
  });

export const canAccessStep = (stepId: Step['id'], userId: User['id']) =>
  new Promise((resolve, reject) => {
    getStep(stepId)
      .then(step =>
        resolve(!!step && canAccessStepCheck(step, userId)),
      )
      .catch(reject);
  });
