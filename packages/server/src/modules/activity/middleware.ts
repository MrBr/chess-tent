import { MiddlewareFunction } from "@types";
import { Activity } from "@chess-tent/models";
import { ActivityNotFoundError, UnauthorizedActivityEditError } from "./errors";
import * as service from "./service";

export const saveActivity: MiddlewareFunction = (req, res, next) => {
  service
    .saveActivity(res.locals.activity as Activity)
    .then(next)
    .catch(next);
};

export const getActivity: MiddlewareFunction = (req, res, next) => {
  service
    .getActivity(res.locals.activity.id as Activity["id"])
    .then(activity => {
      if (!activity) {
        throw new ActivityNotFoundError();
      }
      res.locals.activity = activity;
      next();
    })
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

export const canEditActivity: MiddlewareFunction = (req, res, next) => {
  service
    .canEditActivity(res.locals.activity.id, res.locals.user.id)
    .then(canEdit => {
      if (canEdit) {
        next();
        return;
      }
      throw new UnauthorizedActivityEditError();
    })
    .catch(next);
};