import { register } from 'core-module';
import { ErrorRequestHandler, RequestHandler, Router } from 'express';
import {
  Schema,
  SchemaOptions,
  Document,
  Model,
  FilterQuery,
  Connection,
} from 'mongoose';
import {
  NormalizedUser,
  SubjectPathUpdate,
  User,
  Subject,
  Entity,
  Role,
  NormalizedRole,
  Tag,
} from '@chess-tent/models';
import { Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Messages } from 'mailgun-js';
import {
  ACTION_EVENT,
  Actions,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
  SyncAction,
  UNSUBSCRIBED_EVENT,
  CONNECTION_EVENT,
  DateRange,
} from '@chess-tent/types';
import { RecordAction } from '@chess-tent/redux-record/types';
import * as http from 'http';

export type AppDocument<T> = T & Document & { v: number };
export type EntityDocument<T = Entity> = AppDocument<T>;
export type Updater<T extends EntityDocument> = (
  entity: T,
) => Promise<false | T>;

export type Action = {
  syncAction: (
    id: string,
    type: string,
    socketId: string,
    payload: Entity | undefined | null,
  ) => SyncAction;
};

export type DB = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connection: Connection;
  testUniqueFields: <T>(model: Model<T>, data: Partial<T>) => Promise<string[]>;
  createSchema: <T extends {}>(
    definition: Omit<T, 'id'>,
    options?: SchemaOptions,
    useDefault?: boolean,
  ) => Schema;
  roleSchema: Schema;
  depopulateRole: <T>(role: Role<T>) => NormalizedRole<T>;
  createModel: <T>(type: string, schema: Schema) => Model<AppDocument<T>>;
  orQueries: <T extends FilterQuery<any>>(
    ...args: T[]
  ) => {
    $or: T[] | undefined;
  };
  inQuery: <T, F extends string>(
    field: F,
    value: T[] | T,
  ) => Record<F, { $in: T[] | undefined }> | {};
  allQuery: <T, F extends string>(
    field: F,
    value: T[] | T,
  ) => Record<F, { $all: T[] | undefined }> | {};
  dotNotate: (
    obj: Record<string, any>,
    target?: Record<string, any>,
    prefix?: string,
  ) => Record<string, any>;
  get$SetForArrayElemUpdate: (
    setObject: Record<string, any>,
    arrayName: string,
    elementName: string,
  ) => Record<string, any>;
  getOptionsForArrayElemUpdate: (
    elementName: string,
    ids: string[],
  ) => {
    multi: boolean;
    arrayFilters: {
      [x: string]: {
        $in: string[];
      };
    }[];
  };
  get$SetAndOptionsForArrayElemUpdate: (
    setObject: Record<string, any>,
    arrayName: string,
    ids: string[],
  ) => {
    $set: Record<string, any>;
    options: {
      multi: boolean;
      arrayFilters: {
        [key: string]: {
          $in: string[];
        };
      }[];
    };
  };
  flattenBuckets: (buckets: Record<string, any>[], itemsKey: string) => any;
  getBucketingIdFilterRegex: (parentId: string) => RegExp;
  createAdapter<T extends EntityDocument>(
    ...updaters: Updater<T>[]
  ): Updater<T>;
  applyAdapter<T extends EntityDocument>(
    schema: Schema,
    adapter: Updater<T>,
  ): void;
  getDateRangeFilter(date: DateRange): {
    $gte?: Date;
    $lt?: Date;
  };
};

export type Auth = {
  apiTokenPayload: {
    user: Pick<NormalizedUser, 'id'>;
  };
  resetTokenPayload: {
    user: Pick<NormalizedUser, 'id'>;
  };
};

export type Service = {
  router: Router;
  getUser: (
    userDescr: Partial<User>,
    projection?: string,
  ) => Promise<User | null>;

  addUser: (user: User) => Promise<void>;
  addTag: (tag: Tag) => Promise<void>;
  generateIndex: () => string;
  sendMail: (data: MailData) => Promise<
    | {
        message: string;
        id: string;
      }
    | unknown
  >;
  registerGetRoute: (
    path: string,
    ...cb: ((...args: Parameters<RequestHandler>) => void)[]
  ) => void;
  registerDeleteRoute: (
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

  generateToken: (
    payload: {},
    secret: string,
    options?: { expiresIn?: number },
  ) => string;
  verifyToken: <T extends {}>(token: string, secret: string) => T;
  generateApiToken: (user: User) => string;
  verifyApiToken: (token?: string) => Auth['apiTokenPayload'] | null;

  generatePutFileSignedUrl: (options: {
    Key: string;
    Expires: number;
    ContentType: string;
    ACL?: string;
  }) => Promise<string>;
  fileStorage: AWS.S3;

  subjectPathUpdatesToMongoose: (
    updates: SubjectPathUpdate[],
  ) => Record<string, any>;

  flattenStateToMongoose$set: <T extends Subject>(
    subject: Partial<T>,
  ) => Partial<T>;
};

export type MailData = Parameters<Messages['send']>[0];
export type Middleware = {
  conditional: (
    controller: MiddlewareFunction<boolean | Promise<boolean>>,
  ) => (...args: MiddlewareFunction[]) => MiddlewareFunction;
  identify: (...args: Parameters<RequestHandler>) => void;
  errorHandler: ErrorRequestHandler;
  sendData: (localProp: string) => MiddlewareFunction;
  sendAction: MiddlewareFunction;
  validate: (
    validateFunction: (...args: Parameters<RequestHandler>) => void | never,
  ) => MiddlewareFunction;
  sendMail: (
    formatData: (
      req: Parameters<RequestHandler>[0],
      res: Parameters<RequestHandler>[1],
    ) => MailData,
  ) => MiddlewareFunction;
  logLocal: (
    prefix: string,
    localsKey:
      | string
      | ((
          req: Parameters<MiddlewareFunction>[0],
          res: Parameters<MiddlewareFunction>[1],
        ) => any),
  ) => MiddlewareFunction;
  // A middleware which catches middleware error and continues with the flow.
  // Usually if middleware throws it will break chain.
  // Useful to intercept non-blocking errors.
  catchError: (
    middleware: MiddlewareFunction,
  ) => (
    catchMiddleware?: MiddlewareFunction,
  ) => (...args: Parameters<RequestHandler>) => Promise<void>;
  webLogin: (...args: Parameters<RequestHandler>) => void;
  webLogout: (...args: Parameters<RequestHandler>) => void;
  sendStatusOk: (...args: Parameters<RequestHandler>) => void;
  sendNotifications: (...args: Parameters<RequestHandler>) => void;
  createNotifications: (...args: Parameters<RequestHandler>) => void;
  updateNotifications: (...args: Parameters<RequestHandler>) => void;
  createInitialFounderConversation: (
    ...args: Parameters<RequestHandler>
  ) => void;
  addMentor: (...args: Parameters<RequestHandler>) => void;
  getUser: (
    projection?: string,
  ) => (localKey: string) => (...args: Parameters<RequestHandler>) => void;
  adapter<T extends EntityDocument>(
    entityKey: string,
    ...updaters: Updater<T>[]
  ): (...args: Parameters<RequestHandler>) => void;
  toLocals: (
    localsKey: string,
    func:
      | string
      | number
      | object
      | []
      | ((...args: Parameters<RequestHandler>) => void),
  ) => (...args: Parameters<RequestHandler>) => void;
};
export type MiddlewareFunction<T = void> = (
  ...args: Parameters<RequestHandler>
) => T;

export type Utils = {
  notNullOrUndefined: <T>(object: T) => T;
  formatAppLink: (path: string) => string;
};

export type Application = {
  middleware: Middleware;
  db: DB;
  action: Action;
  service: Service;
  socket: SocketService;
  utils: Utils;
  register: typeof register;
  init: () => Promise<any>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  server: http.Server;
  errors: Errors;
  test: Test;
};

export type ClientSocketStream = {
  client: Socket;
  data: Actions | RecordAction;
};

export type SocketStream =
  | {
      event: typeof CONNECTION_EVENT;
      client: Socket;
    }
  | ({
      event: typeof ACTION_EVENT;
    } & ClientSocketStream)
  | {
      client: Socket;
      event: typeof SUBSCRIBE_EVENT;
      data: string; // room
    }
  | {
      client: Socket;
      event: typeof UNSUBSCRIBE_EVENT;
      data: string; // room
    }
  | {
      clientId: string;
      event: typeof UNSUBSCRIBED_EVENT;
      data: string; // room
    };

export type SocketService = {
  init: (server: HttpServer) => void;
  close: () => void;
  middleware: (
    stream: SocketStream,
    next: (stream: SocketStream) => void,
  ) => void;
  registerMiddleware: (
    middleware: (
      stream: SocketStream,
      next: (stream: SocketStream) => void,
    ) => void,
  ) => void;
  sendAction: (channel: string, stream: ClientSocketStream) => void;
  sendServerAction: (
    channel: string,
    action: Actions | RecordAction,
    toSocketId?: string,
  ) => void;
  dispatchRoomUsers: (room: string) => void;
  getRoomUsers: (room: string) => User['id'][];
  shouldSyncData: (roomId: string) => boolean;
  getOwnerSocketId: (roomId: string) => string;
  identify: (stream: SocketStream | Socket) => Auth['apiTokenPayload'] | null;
};

export interface TestRequest {
  get: (url: string) => this;
  post: (url: string) => this;
  setAuthorization: (user: User) => this;
  setCookies: (cookies: string[]) => this;
  setBody: (data: Object) => this;
  execute: () => Promise<any>;
  reset: () => void;
}

export interface Test {
  start: () => Promise<void>;
  request: TestRequest;
}

export class AppError extends Error {}
export type Errors = {
  BadRequest: typeof AppError;
};
