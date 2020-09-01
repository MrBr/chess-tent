import application, { db } from "@application";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler, sendData, sendStatusOk, toLocals } from "./middleware";
import cookieParser from "cookie-parser";
import { generateIndex } from "./service";

const { connect } = db;

const port = 3007;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.APP_DOMAIN, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

application.middleware.errorHandler = errorHandler;
application.middleware.sendData = sendData;
application.middleware.sendStatusOk = sendStatusOk;
application.middleware.toLocals = toLocals;
application.service.registerGetRoute = (path, ...middlware) =>
  app.get(path, ...middlware);
application.service.registerPostRoute = (path, ...middlware) =>
  app.post(path, ...middlware);
application.service.registerPutRoute = (path, ...middlware) =>
  app.put(path, ...middlware);
application.service.generateIndex = generateIndex;

application.start = () => {
  connect();
  // Error handler must apply after all routes
  app.use(application.middleware.errorHandler);

  app.listen(port, () =>
    console.log(`Application started at http://localhost:${port}`)
  );
};
