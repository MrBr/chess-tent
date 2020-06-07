import { register } from "core-module";
import { RequestHandler } from "express";
import { Schema, SchemaOptions, Document } from "mongoose";
import { Subject } from "@chess-tent/models";

export type DB = {
  connect: () => void;
  createStandardSchema: (definition: {}, options?: SchemaOptions) => Schema;
};

export type Service = {
  saveSubject: <T extends Subject>(subject: T) => Promise<Document>;
  registerGetRoute: (
    path: string,
    cb: (...args: Parameters<RequestHandler>) => void
  ) => void;
  registerPostRoute: (
    path: string,
    ...cb: ((...args: Parameters<RequestHandler>) => void)[]
  ) => void;
};

export type Application = {
  db: DB;
  service: Service;
  register: typeof register;
  init: () => Promise<any>;
  start: () => void;
};
