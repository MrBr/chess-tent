import { register } from "core-module";
import { ErrorRequestHandler, RequestHandler } from "express";
import { Schema, SchemaOptions } from "mongoose";
import { NormalizedUser, User } from "@chess-tent/models";

export type DB = {
  connect: () => void;
  createStandardSchema: <T extends {}>(
    definition: Omit<T, "id">,
    options?: SchemaOptions
  ) => Schema;
};

export type Auth = {
  apiTokenPayload: {
    user: NormalizedUser["id"];
  };
};

export type Service = {
  generateIndex: () => string;
  registerGetRoute: (
    path: string,
    ...cb: ((...args: Parameters<RequestHandler>) => void)[]
  ) => void;
  registerPostRoute: (
    path: string,
    ...cb: ((...args: Parameters<RequestHandler>) => void)[]
  ) => void;
  registerPutRoute: (
    path: string,
    ...cb: ((...args: Parameters<RequestHandler>) => void)[]
  ) => void;

  generateApiToken: (user: User) => string;
  verifyToken: (token: string) => Auth["apiTokenPayload"];

  getUser: (userId: Partial<User>, projection?: string) => Promise<User | null>;

  generateImgUrl: () => string;
  fileStorage: AWS.S3;
};

export type Middleware = {
  identify: (...args: Parameters<RequestHandler>) => void;
  errorHandler: ErrorRequestHandler;
  sendData: (localProp: string) => MiddlewareFunction;
  webLogin: (...args: Parameters<RequestHandler>) => void;
  sendStatusOk: (...args: Parameters<RequestHandler>) => void;
  toLocals: (
    localsKey: string,
    func: (...args: Parameters<RequestHandler>) => void
  ) => (...args: Parameters<RequestHandler>) => void;
};
export type MiddlewareFunction = (...args: Parameters<RequestHandler>) => void;

export type Application = {
  middleware: Middleware;
  db: DB;
  service: Service;
  register: typeof register;
  init: () => Promise<any>;
  start: () => void;
};
