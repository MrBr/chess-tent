import application, { db } from "@application";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler } from "./middleware";

const { connect } = db;

const port = 3007;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

application.middleware.errorHandler = errorHandler;
application.service.registerGetRoute = (path, ...middlware) =>
  app.get(path, ...middlware);
application.service.registerPostRoute = (path, ...middlware) =>
  app.post(path, ...middlware);

application.start = () => {
  connect();
  // Error handler must apply after all routes
  app.use(application.middleware.errorHandler);

  app.listen(port, () =>
    console.log(`Application started at http://localhost:${port}`)
  );
};