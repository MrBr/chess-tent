import { ErrorRequestHandler, RequestHandler } from 'express';
import { Middleware, MiddlewareFunction } from '@types';
import { set } from 'lodash';

// Note - next has to be here; express uses arguments count to determine function signature
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({ error: err.message });
};

export const logLocal: Middleware['logLocal'] =
  (prefix, log) => (req, res, next) => {
    console.log(
      prefix,
      typeof log === 'string' ? res.locals[log] : log(req, res),
    );
    next();
  };

export const sendData: Middleware['sendData'] =
  (localProp: string) => (req, res) => {
    res.json({ data: res.locals[localProp] });
  };

export const catchError: Middleware['catchError'] =
  middleware =>
  catchMiddleware =>
  async (...args) => {
    const next = args[2];
    try {
      await middleware(args[0], args[1], () => {
        next();
      });
    } catch (e) {
      console.error(
        `The error has been intercepted by the catch middleware.
       Usually sign the error isn't critical.
       `,
        e,
      );
      catchMiddleware && catchMiddleware(...args);
      next();
    }
  };

export const validate: Middleware['validate'] =
  validate =>
  (...args) => {
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

export const toLocals: Middleware['toLocals'] =
  (localsKey, value) =>
  async (...args) => {
    const next = args[2];
    let localValue = value;
    if (typeof value === 'function') {
      try {
        localValue = await value(...args);
      } catch (e) {
        return next(e);
      }
    }
    set(args[1].locals, localsKey, localValue);
    next();
  };

const execChainedMiddleware = async (
  chainedMiddleware: MiddlewareFunction[],
  ...args: Parameters<RequestHandler>
) => {
  let index = 0;
  const next = args[2];
  const middlewareArgs = [...args];
  const stubNext = async () => {
    const nextMiddleware = chainedMiddleware[index];
    if (!nextMiddleware) {
      next();
      return;
    }
    await nextMiddleware(...args);
    index++;
    await stubNext();
  };
  middlewareArgs[2] = stubNext;
  await stubNext();
};
export const conditional: Middleware['conditional'] =
  test =>
  (...chainedMiddleware) =>
  async (...args) => {
    const next = args[2];
    try {
      (await test(...args))
        ? execChainedMiddleware(chainedMiddleware, ...args)
        : next();
    } catch (e) {
      next(e);
    }
  };
