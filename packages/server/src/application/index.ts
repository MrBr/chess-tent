import { register, createNamespace, init } from 'core-module';
import {
  Application,
  DB,
  API,
  Errors,
  Middleware,
  Service,
  SocketService,
  Utils,
} from '@types';

const db = createNamespace({}) as DB;
const api = createNamespace({}) as API;
const service = createNamespace({}) as Service;
const errors = createNamespace({}) as Errors;
const socket = createNamespace({}) as SocketService;
const middleware = createNamespace({}) as Middleware;
const utils = createNamespace({}) as Utils;

const application = createNamespace({
  register,
  init,
  db,
  api,
  service,
  middleware,
  socket,
  utils,
  errors,
}) as Application;

export {
  application as default,
  db,
  api,
  service,
  middleware,
  socket,
  utils,
  errors,
};
