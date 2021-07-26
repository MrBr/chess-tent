import { Middleware } from '@types';
import application from '@application';
import { verifyToken } from './service';
import { UnauthorizedError } from './errors';

const COOKIE_TOKEN_KEY = 'token';

export const identify: Middleware['identify'] = (req, res, next) => {
  const token = req.cookies[COOKIE_TOKEN_KEY];
  const tokenPayload = token ? verifyToken(token) : undefined;

  if (!tokenPayload) {
    throw new UnauthorizedError();
  }

  res.locals.me = tokenPayload.user;
  next();
};

export const webLogin: Middleware['webLogin'] = (req, res, next) => {
  const token = application.service.generateApiToken(res.locals.user);
  res.cookie(COOKIE_TOKEN_KEY, token, { httpOnly: true });
  next();
};

export const webLogout: Middleware['webLogout'] = (req, res, next) => {
  res.clearCookie(COOKIE_TOKEN_KEY);
  next();
};
