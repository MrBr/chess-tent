import { MiddlewareFunction } from '@types';
import { Step } from '@chess-tent/models';
import { StepNotFoundError, UnauthorizedStepEditError } from './errors';
import * as service from './service';

export const saveStep: MiddlewareFunction = (req, res, next) => {
  service
    .saveStep(res.locals.step as Step)
    .then(next)
    .catch(next);
};

export const publishStep: MiddlewareFunction = (req, res, next) => {
  service.publishStep(res.locals.step.id).then(next).catch(next);
};

export const unpublishStep: MiddlewareFunction = (req, res, next) => {
  service.unpublishStep(res.locals.step.id).then(next).catch(next);
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
export const canEditStep: MiddlewareFunction = (req, res, next) => {
  service
    .canEditStep(res.locals.step.id, res.locals.me.id)
    .then(canEdit => {
      if (canEdit) {
        next();
        return;
      }
      throw new UnauthorizedStepEditError();
    })
    .catch(next);
};

export const canAccessStep: MiddlewareFunction = (req, res, next) => {
  service
    .canAccessStep(res.locals.step.id, res.locals.me.id)
    .then(canEdit => {
      if (canEdit) {
        next();
        return;
      }
      throw new UnauthorizedStepEditError();
    })
    .catch(next);
};
