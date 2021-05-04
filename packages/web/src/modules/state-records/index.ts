import application from '@application';

import { createRecordHook, createRecordService } from './services';
import { useRecord } from './hooks';
import { updateRecordEntitiesMiddleware } from './state/middleware';
import { records } from './state/reducer';
import { updateRecordAction, updateRecordValueAction } from './state/actions';
import { selectRecord } from './state/selectors';

application.services.createRecordHook = createRecordHook;
application.services.createRecordService = createRecordService;
application.hooks.useRecord = useRecord;
application.state.actions.updateRecord = updateRecordAction;
application.state.actions.updateRecordValue = updateRecordValueAction;
application.state.selectors.selectRecord = selectRecord;
application.state.registerMiddleware(updateRecordEntitiesMiddleware);
application.state.registerReducer('records', records);
