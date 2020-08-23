import { ErrorRequestHandler } from "express";
import { Middleware } from "@types";
import { set } from "lodash";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
};

export const sendData: Middleware["sendData"] = (localProp: string) => (
  req,
  res
) => {
  res.json({ data: res.locals[localProp] });
};

export const sendStatusOk: Middleware["sendStatusOk"] = (req, res) => {
  res.json({ error: null });
};

export const toLocals: Middleware["toLocals"] = (localsKey, func) => (
  ...args
) => {
  set(args[1].locals, localsKey, func(...args));
  args[2]();
};
