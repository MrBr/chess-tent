import { register, createNamespace, init } from "core-module";
import { Application, DB, Middleware, Service, SocketService } from "@types";

const db = createNamespace({}) as DB;
const service = createNamespace({}) as Service;
const socket = createNamespace({}) as SocketService;
const middleware = createNamespace({}) as Middleware;

const application = createNamespace({
  register,
  init,
  db,
  service,
  middleware,
  socket
}) as Application;

export { application as default, db, service, middleware, socket };
