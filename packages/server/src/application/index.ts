import { register, createNamespace, init } from "core-module";
import { Application, DB, Middleware, Service } from "@types";

const db = createNamespace({}) as DB;
const service = createNamespace({}) as Service;
const middleware = createNamespace({}) as Middleware;

const application = createNamespace({
  register,
  init,
  db,
  service,
  middleware
}) as Application;

export { application as default, db, service };
