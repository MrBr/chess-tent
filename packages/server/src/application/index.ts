import { register, createNamespace, init } from "core-module";
import { Application, DB, Service } from "@types";

const db = createNamespace({}) as DB;
const service = createNamespace({}) as Service;

const application = createNamespace({
  register,
  init,
  db,
  service
}) as Application;

export { application as default, db, service };
