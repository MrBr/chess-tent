import { ErrorRequestHandler } from 'express';
import { Middleware } from '@types';
import { set } from 'lodash';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({ error: err.message });
};

export const logLocal: Middleware['logLocal'] = (prefix, log) => (
  req,
  res,
  next,
) => {
  console.log(
    prefix,
    typeof log === 'string' ? res.locals[log] : log(req, res),
  );
  next();
};

export const sendData: Middleware['sendData'] = (localProp: string) => (
  req,
  res,
) => {
  res.json({ data: res.locals[localProp] });
};

export const validate: Middleware['validate'] = validate => (...args) => {
  const next = args[2];
  try {
    validate(...args);
    next();
  } catch (e) {
    next(e);
  }
};

export const sendStatusOk: Middleware['sendStatusOk'] = (req, res) => {
  res.json({ error: null });
};

export const toLocals: Middleware['toLocals'] = (localsKey, value) => (
  ...args
) => {
  const next = args[2];
  set(
    args[1].locals,
    localsKey,
    typeof value === 'function' ? value(...args) : value,
  );
  next();
};
