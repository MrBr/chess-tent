import { register } from "core-module";
import { ErrorRequestHandler, RequestHandler } from "express";
import { Schema, SchemaOptions, Document, Model } from "mongoose";
import { NormalizedUser, SubjectPathUpdate, User } from "@chess-tent/models";
import { Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {
  ACTION_EVENT,
  Actions,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
} from "@chess-tent/types";

export type DB = {
  connect: () => void;
  createSchema: <T extends {}>(
    definition: Omit<T, "id">,
    options?: SchemaOptions,
    useDefault?: boolean
  ) => Schema;
  createModel: <T>(type: string, schema: Schema) => Model<Document & T>;
};

export type Auth = {
  apiTokenPayload: {
    user: NormalizedUser;
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
  verifyToken: (token?: string) => Auth["apiTokenPayload"] | null;

  generateImgUrl: () => string;
  fileStorage: AWS.S3;

  subjectPathUpdatesToMongoose$set: (
    updates: SubjectPathUpdate[]
  ) => Record<string, any>;
};

export type Middleware = {
  identify: (...args: Parameters<RequestHandler>) => void;
  errorHandler: ErrorRequestHandler;
  sendData: (localProp: string) => MiddlewareFunction;
  logLocal: (
    prefix: string,
    localsKey:
      | string
      | ((
          req: Parameters<MiddlewareFunction>[0],
          res: Parameters<MiddlewareFunction>[1]
        ) => any)
  ) => MiddlewareFunction;
  webLogin: (...args: Parameters<RequestHandler>) => void;
  webLogout: (...args: Parameters<RequestHandler>) => void;
  sendStatusOk: (...args: Parameters<RequestHandler>) => void;
  sendNotification: (...args: Parameters<RequestHandler>) => void;
  createNotification: (...args: Parameters<RequestHandler>) => void;
  getUser: (...args: Parameters<RequestHandler>) => void;
  toLocals: (
    localsKey: string,
    func:
      | string
      | number
      | object
      | []
      | ((...args: Parameters<RequestHandler>) => void)
  ) => (...args: Parameters<RequestHandler>) => void;
};
export type MiddlewareFunction = (...args: Parameters<RequestHandler>) => void;

export type Utils = {
  notNullOrUndefined: <T>(object: T) => T;
};

export type Application = {
  middleware: Middleware;
  db: DB;
  service: Service;
  socket: SocketService;
  utils: Utils;
  register: typeof register;
  init: () => Promise<any>;
  start: () => void;
};

export type SocketStream =
  | {
      client: Socket;
      event: typeof ACTION_EVENT;
      data: Actions;
    }
  | {
      client: Socket;
      event: typeof SUBSCRIBE_EVENT;
      data: string;
    }
  | {
      client: Socket;
      event: typeof UNSUBSCRIBE_EVENT;
      data: string;
    };

export type SocketService = {
  init: (server: HttpServer) => void;
  middleware: (
    stream: SocketStream,
    next: (stream: SocketStream) => void
  ) => void;
  registerMiddleware: (
    middleware: (
      stream: SocketStream,
      next: (stream: SocketStream) => void
    ) => void
  ) => void;
  sendAction: (channel: string, stream: SocketStream) => void;
  sendServerAction: (channel: string, action: Actions) => void;
  identify: (stream: SocketStream) => Auth["apiTokenPayload"] | null;
};
