import { MiddlewareFunction } from "@types";
import { User } from "@chess-tent/models";
import * as service from "./service";
import {
  InvalidUserFiltersError,
  LoginFailedError,
  PasswordEncryptionError
} from "./errors";
import { validateUserPassword } from "./service";

export const addUser: MiddlewareFunction = (req, res, next) => {
  service
    .addUser(res.locals.user as User)
    .then(user => {
      res.locals.user = user;
      next();
    })
    .catch(next);
};

export const updateUser: MiddlewareFunction = (req, res, next) => {
  service
    .updateUser(res.locals.user.id, res.locals.user)
    .then(next)
    .catch(next);
};

export const getUser: MiddlewareFunction = (req, res, next) => {
  service
    .getUser(res.locals.user)
    .then(user => {
      res.locals.user = user;
      next();
    })
    .catch(next);
};

export const findUsers: MiddlewareFunction = (req, res, next) => {
  if (!res.locals.filters || Object.keys(res.locals.filters).length < 0) {
    throw new InvalidUserFiltersError();
  }
  service
    .findUsers(res.locals.filters)
    .then(users => {
      res.locals.users = users;
      next();
    })
    .catch(next);
};

export const validateUser: MiddlewareFunction = (req, res, next) => {
  const error = service.validateUser(res.locals.user);
  if (error) {
    throw error;
  }
  next();
};

export const verifyUser: MiddlewareFunction = async (req, res, next) => {
  // Clearing projection to get password for verification
  const user = await service.getUser(
    { email: res.locals.user.email },
    "+password"
  );

  const authorized = user
    ? await validateUserPassword(res.locals.user, user.password)
    : false;

  res.locals.user = user;
  delete res.locals.user.password;

  authorized ? next() : next(new LoginFailedError());
};

export const hashPassword: MiddlewareFunction = (req, res, next) => {
  service
    .hashPassword(res.locals.user.password)
    .then(passwordHash => {
      res.locals.user.password = passwordHash;
      next();
    })
    .catch(() => {
      throw new PasswordEncryptionError();
    });
};
