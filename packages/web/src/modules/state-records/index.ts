import application from '@application';
import {
  collectionRecipe,
  concatRecordAction,
  createRecord,
  pushRecordAction,
  records,
  updateRecordAction,
  useRecordInit,
  useRecordSafe,
} from '@chess-tent/redux-record';
import {
  createApiRecipe,
  createDenormalizedRecipe,
  createDenormalizedCollectionRecipe,
} from './recipes';
import { isInitialized } from './service';
import { middleware } from './state/middleware';

application.hooks.useRecordInit = useRecordInit;
application.hooks.useRecordSafe = useRecordSafe;
application.state.actions.pushRecord = pushRecordAction;
application.state.actions.updateRecord = updateRecordAction;
application.state.actions.concatRecord = concatRecordAction;
application.records.createRecord = createRecord;
application.records.isInitialized = isInitialized;
application.records.collectionRecipe = collectionRecipe;
application.records.createApiRecipe = createApiRecipe;
application.records.createDenormalizedRecipe = createDenormalizedRecipe;
application.records.createDenormalizedCollectionRecipe =
  createDenormalizedCollectionRecipe;
application.state.registerReducer('records', records);
application.state.registerMiddleware(middleware);
