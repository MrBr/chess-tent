import { ErrorRequestHandler } from "express";
import { Middleware, MiddlewareFunction } from "@types";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({ error: err.message });
};

export const sendData: Middleware["sendData"] = (localProp: string) => (
  req,
  res
) => {
  res.send({ data: res.locals[localProp] });
};
