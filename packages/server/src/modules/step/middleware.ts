import { MiddlewareFunction } from '@types';
import { Step, User } from '@chess-tent/models';
import { StepNotFoundError } from './errors';
import * as service from './service';

export const saveStep: MiddlewareFunction = (req, res, next) => {
  service
    .saveStep(res.locals.step as Step, res.locals.me as User)
    .then(next)
    .catch(next);
};

export const patchStep: MiddlewareFunction = (req, res, next) => {
  service.patchStep(res.locals.step.id, res.locals.step).then(next).catch(next);
};

export const getStep: MiddlewareFunction = (req, res, next) => {
  service
    .getStep(res.locals.step.id as Step['id'])
    .then(step => {
      if (!step) {
        throw new StepNotFoundError();
      }
      res.locals.step = step;
      next();
    })
    .catch(next);
};

export const deleteStep: MiddlewareFunction = (req, res, next) => {
  service
    .deleteStep(res.locals.step.id as Step['id'])
    .then(next)
    .catch(next);
};

export const findSteps: MiddlewareFunction = (req, res, next) => {
  service
    .findSteps(res.locals.filters)
    .then(steps => {
      if (!steps) {
        throw new StepNotFoundError();
      }
      res.locals.steps = steps;
      next();
    })
    .catch(next);
};
