import { register } from "core-module";
import { RequestHandler } from "express";
import { Schema, SchemaOptions } from "mongoose";
import { NormalizedUser, Subject, User } from "@chess-tent/models";

export type DB = {
  connect: () => void;
  createStandardSchema: <T extends {}>(
    definition: Omit<T, "id">,
    options?: SchemaOptions
  ) => Schema;
};

export type Auth = {
  tokenPayload: {
    user: NormalizedUser["id"];
  };
};

export type Service = {
  saveSubject: <T extends Subject>(subject: T) => Promise<T>;
  getSubject: <T extends Subject>(subjectId: T["id"]) => Promise<T>;
  findSubjects: <T extends Subject>(subject: Partial<T>) => Promise<T[]>;

  registerGetRoute: (
    path: string,
    cb: (...args: Parameters<RequestHandler>) => void
  ) => void;
  registerPostRoute: (
    path: string,
    ...cb: ((...args: Parameters<RequestHandler>) => void)[]
  ) => void;

  generateToken: (payload: Auth["tokenPayload"]) => string;
  verifyToken: (token: string) => Auth["tokenPayload"];

  getUser: (user: Partial<User>) => Promise<User>;
};

export type Middleware = {
  identify: (...args: Parameters<RequestHandler>) => void;
};

export type MiddlewareFunction = (...args: Parameters<RequestHandler>) => void;

export type Application = {
  db: DB;
  service: Service;
  register: typeof register;
  init: () => Promise<any>;
  start: () => void;
};
