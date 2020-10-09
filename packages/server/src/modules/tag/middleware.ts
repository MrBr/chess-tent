import { MiddlewareFunction } from "@types";
import * as service from "./service";

export const findTags: MiddlewareFunction = (req, res, next) => {
  service
    .findTags(res.locals.startsWith)
    .then(tags => {
      res.locals.tags = tags;
    })
    .catch(next);
};
