import application, { db, socket } from '@application';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'http';

import {
  catchError,
  conditional,
  errorHandler,
  logLocal,
  sendData,
  sendStatusOk,
  toLocals,
  validate,
} from './middleware';
import {
  generateIndex,
  getCorsOrigin,
  startHttpServer,
  startHttpsServer,
} from './service';
import { BadRequest } from './errors';
import { formatAppLink, shouldStartHttpsServer } from './utils';

const { connect, disconnect } = db;

let server: Server;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(
  cors({
    origin: getCorsOrigin(),
    credentials: true,
  }),
);

app.use(cookieParser(process.env.COOKIE_SECRET));

application.service.router = app;
application.errors.BadRequest = BadRequest;
application.middleware.errorHandler = errorHandler;
application.middleware.sendData = sendData;
application.middleware.sendStatusOk = sendStatusOk;
application.middleware.logLocal = logLocal;
application.middleware.validate = validate;
application.middleware.toLocals = toLocals;
application.middleware.catchError = catchError;
application.middleware.conditional = conditional;
application.service.registerGetRoute = (path, ...middlware) =>
  app.get(process.env.API_BASE_PATH + path, ...middlware);
application.service.registerPostRoute = (path, ...middlware) =>
  app.post(process.env.API_BASE_PATH + path, ...middlware);
application.service.registerPutRoute = (path, ...middlware) =>
  app.put(process.env.API_BASE_PATH + path, ...middlware);
application.service.registerDeleteRoute = (path, ...middlware) =>
  app.delete(process.env.API_BASE_PATH + path, ...middlware);
application.service.generateIndex = generateIndex;
application.utils.formatAppLink = formatAppLink;

application.stop = async () => {
  await disconnect();
  server?.close(() => console.log('closing http server'));
  socket?.close();
};

application.start = async () => {
  await connect();
  // Error handler must apply after all routes
  app.use(application.middleware.errorHandler);

  if (shouldStartHttpsServer()) {
    server = startHttpsServer(app);
  } else {
    server = startHttpServer(app);
  }

  socket.init(server);
};

application.test.start = async () => {
  generateUniqueDbName();
  await connect();
  await application.db.migrate('up');
  // TODO - should be a part of the lifecycle hook/event
  app.use(application.middleware.errorHandler);
};

const generateUniqueDbName = (): void => {
  const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9]/g, '');
  process.env.DB_NAME = `chessTent_${timestamp}`;
};
