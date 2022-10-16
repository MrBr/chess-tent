import { Middleware, MiddlewareFunction } from '@types';
import { User } from '@chess-tent/models';
import { errors, middleware, db } from '@application';
import * as service from './service';
import {
  AccountNotActivatedError,
  InvalidUserFiltersError,
  LoginFailedError,
  PasswordEncryptionError,
} from './errors';
import { validateUserPassword } from './service';

const { sendMail } = middleware;

export const welcomeMailMiddleware = sendMail((req, res) => ({
  from: 'Chess Tent <noreply@chesstent.com>',
  to: res.locals.user.email,
  subject: 'Welcome to the virtual chess gym',
  html: `<p>Dear ${res.locals.user.name},</p>
       <p>Thank you for registering. We are still in very early phase and feedback is much appreciated.</p>
       <p>${
         res.locals.user.coach ? 'Start teaching at ' : 'Start learning at '
       } <a href="https://chesstent.com">chesstent.com</a>. </p>
       <p>Best Regards, <br/>Chess Tent Team</p>`,
}));

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

export const getUser: Middleware['getUser'] = localKey => (req, res, next) => {
  service
    .getUser(res.locals[localKey])
    .then(user => {
      res.locals[localKey] = user;
      next();
    })
    .catch(next);
};

export const findCoaches: MiddlewareFunction = (req, res, next) => {
  if (!res.locals.filters || Object.keys(res.locals.filters).length < 0) {
    throw new InvalidUserFiltersError();
  }
  service
    .findCoaches(res.locals.filters)
    .then(users => {
      res.locals.users = users;
      next();
    })
    .catch(next);
};

export const validateUser: (skipPaths?: (keyof User)[]) => MiddlewareFunction =
  skipPaths => async (req, res, next) => {
    try {
      await service.validateUser(res.locals.user, skipPaths);
    } catch (e) {
      next(e);
    }
    next();
  };

export const updateUserActivity: MiddlewareFunction = (req, res, next) => {
  service
    .updateUser(res.locals.me.id, {
      state: { lastActivity: new Date() },
    })
    .then(next)
    .catch(next);
};

export const verifyUser: MiddlewareFunction = async (req, res, next) => {
  // Clearing projection to get password for verification
  try {
    if (typeof res.locals.user !== 'object') {
      throw new errors.BadRequest();
    }
    const user = await service.getUser(
      { email: res.locals.user.email },
      '+password',
    );

    const authorized = user
      ? await validateUserPassword(res.locals.user, user.password as string)
      : false;

    if (!authorized) {
      throw new LoginFailedError();
    }

    if (!user?.active) {
      throw new AccountNotActivatedError();
    }

    delete user.password;
    res.locals.user = user;

    next();
  } catch (err) {
    next(err);
  }
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
