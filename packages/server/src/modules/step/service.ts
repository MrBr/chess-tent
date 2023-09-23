import { Step } from '@chess-tent/models';
import { depopulate, DepopulatedStep, StepModel } from './model';
import { AppDocument } from '@types';
import { SubjectFilters } from '@chess-tent/types';
import { FilterQuery } from 'mongoose';
import _ from 'lodash';

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
    StepModel.updateOne({ _id: stepId }, { $set: depopulate(step) }).exec(
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
      query['tags'] = { $in: filters.tagIds };
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

export const stepExists = async (stepId: Step['id']) => {
  const query: FilterQuery<AppDocument<DepopulatedStep>> = { id: stepId };
  return StepModel.exists(query);
};
