import { register, createNamespace, init } from 'core-module';
import {
  Application,
  DB,
  Errors,
  Middleware,
  Service,
  SocketService,
  Utils,
} from '@types';

const db = createNamespace({}) as DB;
const service = createNamespace({}) as Service;
const errors = createNamespace({}) as Errors;
const socket = createNamespace({}) as SocketService;
const middleware = createNamespace({}) as Middleware;
const utils = createNamespace({}) as Utils;

const application = createNamespace({
  register,
  init,
  db,
  service,
  middleware,
  socket,
  utils,
  errors,
}) as Application;

export {
  application as default,
  db,
  service,
  middleware,
  socket,
  utils,
  errors,
};
