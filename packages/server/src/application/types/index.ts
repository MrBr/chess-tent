import { register } from "core-module";
import { RequestHandler } from "express";
import { Schema, SchemaOptions } from "mongoose";
import { Subject, User } from "@chess-tent/models";

export type DB = {
  connect: () => void;
  createStandardSchema: <T extends {}>(
    definition: Omit<T, "id">,
    options?: SchemaOptions
  ) => Schema;
};

export type Service = {
  saveSubject: <T extends Subject>(subject: T) => Promise<T>;

  registerGetRoute: (
    path: string,
    cb: (...args: Parameters<RequestHandler>) => void
  ) => void;
  registerPostRoute: (
    path: string,
    ...cb: ((...args: Parameters<RequestHandler>) => void)[]
  ) => void;

  generateToken: <T extends {}>(payload: T) => string;
  verifyToken: <T extends {}>(token: string) => T;

  generateUserToken: (user: User) => string;
  identifyUser: (token: string) => Promise<User>;
  getUser: (user: Partial<User>) => Promise<User>;
};

export type Middleware = {
  identify: (...args: Parameters<RequestHandler>) => void;
};

export type Application = {
  db: DB;
  service: Service;
  register: typeof register;
  init: () => Promise<any>;
  start: () => void;
};
