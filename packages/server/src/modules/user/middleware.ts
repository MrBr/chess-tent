import { MiddlewareFunction } from '@types';
import { createConversation, createMessage, User } from '@chess-tent/models';
import application, { errors, middleware } from '@application';
import * as service from './service';
import {
  AccountNotActivatedError,
  InvalidUserFiltersError,
  LoginFailedError,
  PasswordEncryptionError,
} from './errors';
import { validateUserPassword } from './service';

const { toLocals } = middleware;

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

export const updateUserActivity: MiddlewareFunction = (req, res, next) => {
  service
    .updateUser(res.locals.user.id, {
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

    if (!user?.active) {
      throw new AccountNotActivatedError();
    }

    const authorized = user
      ? await validateUserPassword(res.locals.user, user.password)
      : false;

    if (!authorized) {
      throw new LoginFailedError();
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

export const createInitialFounderConversation = toLocals(
  'conversation',
  async (req, res) => {
    const { founder, user } = res.locals;
    const participants = [user, founder];

    const messages = [
      `Hi!`,
      `I am Luka. The founder of Chess Tent platform. For the time being I'll be you support :)`,
      `Chess Tent is truly aiming to be a community driven platform so every feedback is of great value. The platform is still in early phase so don't mind a bug or few. `,
      `Feel free to let me know if you have any questions.`,
      `Thank you for signing up! Have a good chess time.`,
    ].map(message =>
      createMessage(application.service.generateIndex(), founder, message),
    );

    return createConversation(
      application.service.generateIndex(),
      participants,
      messages,
    );
  },
);
