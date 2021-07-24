import application, { db, socket } from '@application';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  errorHandler,
  logLocal,
  sendData,
  sendStatusOk,
  toLocals,
  validate,
} from './middleware';
import { generateIndex } from './service';
import { BadRequest } from './errors';

const { connect } = db;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.APP_DOMAIN, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

application.errors.BadRequest = BadRequest;
application.middleware.errorHandler = errorHandler;
application.middleware.sendData = sendData;
application.middleware.sendStatusOk = sendStatusOk;
application.middleware.logLocal = logLocal;
application.middleware.validate = validate;
application.middleware.toLocals = toLocals;
application.service.registerGetRoute = (path, ...middlware) =>
  app.get(process.env.API_BASE_PATH + path, ...middlware);
application.service.registerPostRoute = (path, ...middlware) =>
  app.post(process.env.API_BASE_PATH + path, ...middlware);
application.service.registerPutRoute = (path, ...middlware) =>
  app.put(process.env.API_BASE_PATH + path, ...middlware);
application.service.generateIndex = generateIndex;

application.start = () => {
  connect();
  // Error handler must apply after all routes
  app.use(application.middleware.errorHandler);

  const server = app.listen(process.env.PORT, () =>
    console.log(`Application started at port: ${process.env.PORT}`),
  );
  socket.init(server);
};
