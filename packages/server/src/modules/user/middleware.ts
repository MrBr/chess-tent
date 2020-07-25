import { MiddlewareFunction } from "@types";
import { User } from "@chess-tent/models";
import * as service from "./service";

export const saveUser: MiddlewareFunction = (req, res, next) => {
  service
    .saveUser(req.body as User)
    .then(user => {
      res.locals.user = user;
      next();
    })
    .catch(next);
};

export const validateUser: MiddlewareFunction = (req, res, next) => {
  const error = service.validateUser(req.body);
  if (error) {
    throw error;
  }
  next();
};

export const sendUser: MiddlewareFunction = (req, res) => {
  res.send(res.locals.user);
};
