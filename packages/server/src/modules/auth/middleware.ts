import { verifyToken } from "./service";
import { Middleware } from "@types";

export const identify: Middleware["identify"] = (req, res, next) => {
  const user = req.headers.authorization
    ? verifyToken(req.headers.authorization)
    : undefined;

  res.locals.user = user;
  user
    ? next()
    : res.status(403).send({
        error: "Unauthorized"
      });
};
