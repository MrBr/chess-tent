import { verifyToken } from "./service";
import { Middleware } from "@types";
import { UnauthorizedError } from "./errors";

export const identify: Middleware["identify"] = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  const tokenPayload = token ? verifyToken(token) : undefined;

  if (!tokenPayload) {
    throw new UnauthorizedError();
  }

  res.locals.user = tokenPayload.user;
  next();
};
