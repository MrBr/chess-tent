import { verifyToken } from "./service";
import { Middleware } from "@types";
import { UnauthorizedError } from "./errors";
import application from "@application";

const COOKIE_TOKEN_KEY = "token";

export const identify: Middleware["identify"] = (req, res, next) => {
  const token = req.cookies[COOKIE_TOKEN_KEY];
  const tokenPayload = token ? verifyToken(token) : undefined;

  if (!tokenPayload) {
    throw new UnauthorizedError();
  }

  res.locals.user = tokenPayload.user;
  next();
};

export const webLogin: Middleware["identify"] = (req, res, next) => {
  const token = application.service.generateApiToken(res.locals.user);
  res.cookie(COOKIE_TOKEN_KEY, token, { httpOnly: true });
  next();
};
