import { Step, User } from '@chess-tent/models';
import { DepopulatedStep, StepModel } from './model';
import { AppDocument } from '@types';
import { db, utils } from '@application';
import { SubjectFilters } from '@chess-tent/types';
import { FilterQuery } from 'mongoose';
import _ from 'lodash';

const depopulateStep = (step: Partial<Step>, depopulate = 'tags') => {
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
  populate = 'tags',
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
    const query: FilterQuery<AppDocument<DepopulatedStep>> = {};

    if (filters.difficulty) {
      query['difficulty'] = { $eq: filters.difficulty };
    }

    if (!_.isEmpty(filters.tagIds)) {
      // query['tags'] = { $in: filters.tagIds }; // todo: compiler is barking about this
    }

    if (filters.search) {
      query['$text'] = { $search: filters.search, $caseSensitive: false };
    }

    StepModel.find(query)
      .populate('tags')
      .select('-state.chapters.state.steps.state.steps')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject<Step>()));
      });
  });
