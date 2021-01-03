import mongoose from 'mongoose';
import application from '@application';

import { createModel, createSchema, orQueries } from './utils';

// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = process.env.DB_NAME;

application.db.connect = () => {
  mongoose.connect(`${url}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // Usually a costly operation, but we have too little data right now for it to matter
    // It makes dev's life easier by creating indexes automatically
    autoIndex: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('DB connection open');
  });
};

application.db.createSchema = createSchema;
application.db.createModel = createModel;
application.db.orQueries = orQueries;

export {};
