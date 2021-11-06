import application from '@application';
import {
  createRecord,
  pushRecordAction,
  records,
  updateRecordAction,
  useRecordInit,
  useRecordSafe,
  withRecordBase,
  withRecordCollection,
  withRecordMethod,
} from '@chess-tent/redux-record';
import {
  withRecordApiLoad,
  withRecordDenormalized,
  withRecordDenormalizedCollection,
} from './recipes';
import { isInitialized } from './service';

application.hooks.useRecordInit = useRecordInit;
application.hooks.useRecordSafe = useRecordSafe;
application.state.actions.pushRecord = pushRecordAction;
application.state.actions.updateRecord = updateRecordAction;
application.records.createRecord = createRecord;
application.records.isInitialized = isInitialized;
application.records.withRecordBase = withRecordBase;
application.records.withRecordCollection = withRecordCollection;
application.records.withRecordApiLoad = withRecordApiLoad;
application.records.withRecordDenormalized = withRecordDenormalized;
application.records.withRecordDenormalizedCollection = withRecordDenormalizedCollection;
application.records.withRecordMethod = withRecordMethod;
application.state.registerReducer('records', records);
