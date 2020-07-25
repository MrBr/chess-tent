import mongoose, { Schema } from "mongoose";
import application from "@application";

import { createStandardSchema } from "./utils";
import { indexEntity } from "./middleware";

// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = process.env.DB_NAME;

application.db.connect = () => {
  mongoose.connect(`${url}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    console.log("DB connection open");
  });
};

application.db.createStandardSchema = createStandardSchema;
application.middleware.indexEntity = indexEntity;

export {};
