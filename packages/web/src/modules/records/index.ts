import application from '@application';

import { createRecordHook } from './services';
import { useRecord } from './state/hooks';
import { updateRecordEntitiesMiddleware } from './state/middleware';
import { records } from './state/reducer';

application.services.createRecordHook = createRecordHook;
application.hooks.useRecord = useRecord;
application.state.registerMiddleware(updateRecordEntitiesMiddleware);
application.state.registerReducer('records', records);
