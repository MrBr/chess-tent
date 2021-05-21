import application from '@application';

import {
  createRecordHook,
  createCollectionRecordHook,
  createRecordService,
} from './services';
import { useRecord, useCollectionRecord } from './hooks';
import { updateRecordEntitiesMiddleware } from './state/middleware';
import { records } from './state/reducer';
import {
  updateRecordAction,
  pushRecordAction,
  updateRecordValueAction,
} from './state/actions';
import { selectRecord } from './state/selectors';

application.services.createRecordHook = createRecordHook;
application.services.createCollectionRecordHook = createCollectionRecordHook;
application.services.createRecordService = createRecordService;
application.hooks.useRecord = useRecord;
application.hooks.useCollectionRecord = useCollectionRecord;
application.state.actions.updateRecord = updateRecordAction;
application.state.actions.pushRecord = pushRecordAction;
application.state.actions.updateRecordValue = updateRecordValueAction;
application.state.selectors.selectRecord = selectRecord;
application.state.registerMiddleware(updateRecordEntitiesMiddleware);
application.state.registerReducer('records', records);
