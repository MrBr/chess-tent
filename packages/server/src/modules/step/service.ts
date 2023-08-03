import { Step, User } from '@chess-tent/models';
import { DepopulatedStep, StepModel } from './model';
import { AppDocument } from '@types';
import { db, utils } from '@application';
import { SubjectFilters } from '@chess-tent/types';
import { FilterQuery } from 'mongoose';
import _ from 'lodash';

const depopulateStep = (
  step: Partial<Step>,
  depopulate = 'owner tags users',
) => {
  let transformed = new StepModel(step);
  return transformed.depopulate(depopulate);
};

export const saveStep = (step: Step) =>
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
      // query['tags'] = { $in: filters.tagIds }; // todo: compiler is barking about thisxx
    }

    if (filters.search) {
      query['$text'] = { $search: filters.search, $caseSensitive: false };
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
