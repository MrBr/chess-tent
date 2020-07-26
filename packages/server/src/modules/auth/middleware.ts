import { verifyToken } from "./service";
import { Middleware } from "@types";
import { UnauthorizedError } from "./errors";

export const identify: Middleware["identify"] = (req, res, next) => {
  const user = req.headers.authorization
    ? verifyToken(req.headers.authorization)
    : undefined;

  if (!user) {
    throw new UnauthorizedError();
  }

  res.locals.user = user;
  next();
};
