import mongoose from 'mongoose';
import application from '@application';

import {
  createModel,
  createSchema,
  inQuery,
  orQueries,
  dotNotate,
  get$SetForArrayElemUpdate,
  getOptionsForArrayElemUpdate,
  get$SetAndOptionsForArrayElemUpdate,
  flattenBuckets,
  getBucketingIdFilterRegex,
  getDateRangeFilter,
} from './utils';
import { applyAdapter, createAdapter } from './adapter';

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
application.db.inQuery = inQuery;
application.db.dotNotate = dotNotate;
application.db.get$SetForArrayElemUpdate = get$SetForArrayElemUpdate;
application.db.getOptionsForArrayElemUpdate = getOptionsForArrayElemUpdate;
application.db.get$SetAndOptionsForArrayElemUpdate =
  get$SetAndOptionsForArrayElemUpdate;
application.db.flattenBuckets = flattenBuckets;
application.db.getBucketingIdFilterRegex = getBucketingIdFilterRegex;
application.db.createAdapter = createAdapter;
application.db.applyAdapter = applyAdapter;
application.db.getDateRangeFilter = getDateRangeFilter;
