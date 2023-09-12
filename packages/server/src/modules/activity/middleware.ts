import application, { socket } from '@application';
import { MiddlewareFunction } from '@types';
import { Activity } from '@chess-tent/models';
import { PUSH_RECORD } from '@chess-tent/redux-record';

import {
  ActivityNotFoundError,
  UnauthorizedActivityEditError,
  ActivityNotPreparedError,
} from './errors';
import * as service from './service';

export const saveActivity: MiddlewareFunction = (req, res, next) => {
  service
    .saveActivity(res.locals.activity as Activity)
    .then(next)
    .catch(next);
};

export const patchActivity: MiddlewareFunction = (req, res, next) => {
  service
    .patchActivity(res.locals.activity.id, res.locals.patch)
    .then(next)
    .catch(next);
};

export const updateActivity: MiddlewareFunction = (req, res, next) => {
  service
    .updateActivity(res.locals.activity.id, res.locals.updates)
    .then(next)
    .catch(next);
};

export const getActivity: MiddlewareFunction = (req, res, next) => {
  service
    .getActivity(res.locals.activity.id as Activity['id'])
    .then(activity => {
      if (!activity) {
        throw new ActivityNotFoundError();
      }
      res.locals.activity = activity;
      next();
    })
    .catch(next);
};
export const deleteActivity: MiddlewareFunction = (req, res, next) => {
  service
    .deleteActivity(res.locals.activity.id as Activity['id'])
    .then(next)
    .catch(next);
};

export const findActivities: MiddlewareFunction = (req, res, next) => {
  service
    .findActivities(res.locals.filters)
    .then(activities => {
      res.locals.activities = activities;
      next();
    })
    .catch(next);
};

export const canEditActivities =
  (key: string): MiddlewareFunction =>
  (req, res, next) => {
    const canEdit = service.canEditActivities(res.locals[key], res.locals.me);
    if (!canEdit) {
      throw new UnauthorizedActivityEditError();
    }
    next();
  };

export const sendActivity: MiddlewareFunction = async (req, res, next) => {
  const activity = res.locals.activity as Activity;
  if (!activity) {
    throw new ActivityNotPreparedError();
  }
  // TODO - verify if this is working
  (await application.service.getUsersWithRole(activity, 'Participator'))
    .filter(({ id }) => id !== res.locals.me.id)
    .forEach(({ id }) => {
      // Don't send lesson to the same user that assign it
      socket.sendServerAction(`user-${id}`, {
        type: PUSH_RECORD,
        payload: { value: activity },
        meta: {
          key: `trainings-${id}`,
        },
      });
    });

  next();
};
