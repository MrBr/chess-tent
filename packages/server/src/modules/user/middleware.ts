import application from "@application";
import { MiddlewareFunction } from "@types";
import { User } from "@chess-tent/models";
import * as service from "./service";
import { LoginFailedError, PasswordEncryptionError } from "./errors";
import { validateUserPassword } from "./service";

export const saveUser: MiddlewareFunction = (req, res, next) => {
  service
    .saveUser(res.locals.user as User)
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

export const loginUser: MiddlewareFunction = async (req, res, next) => {
  const user = await service.getUser({ email: res.locals.user.email });

  const authorized = user
    ? await validateUserPassword(res.locals.user, user.password)
    : false;

  if (!authorized) {
    next(new LoginFailedError());
  }

  const token = application.service.generateToken(res.locals.user);
  res.locals.token = token;
  next();
};

export const prepareUser: MiddlewareFunction = (req, res, next) => {
  res.locals.user = req.body;
  next();
};

export const hashPassword: MiddlewareFunction = (req, res, next) => {
  service
    .hashPassword(req.body.password)
    .then(passwordHash => {
      res.locals.user.password = passwordHash;
      next();
    })
    .catch(() => {
      throw new PasswordEncryptionError();
    });
};
