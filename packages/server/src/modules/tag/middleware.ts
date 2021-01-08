import { MiddlewareFunction } from '@types';
import * as service from './service';

export const getAll: MiddlewareFunction = (req, res, next) => {
  service
    .getAll()
    .then(tags => {
      res.locals.tags = tags;
      next();
    })
    .catch(next);
};

export const findTags: MiddlewareFunction = (req, res, next) => {
  service
    .findTags(res.locals.startsWith)
    .then(tags => {
      res.locals.tags = tags;
      next();
    })
    .catch(next);
};
