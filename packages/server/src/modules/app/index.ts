import application, { db } from "@application";
import express from "express";
import bodyParser from "body-parser";

const { connect } = db;

const port = 3007;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

application.start = () => {
  connect();
  app.listen(port, () =>
    console.log(`Application started at http://localhost:${port}`)
  );
};

application.service.registerGetRoute = (path, ...middlware) =>
  app.get(path, ...middlware);
application.service.registerPostRoute = (path, ...middlware) =>
  app.post(path, ...middlware);
