import application from '@application';

import './service';
import './middleware/sync-middleware';
import './middleware/unsubscribe-middleware';
import './middleware/send-action';

application.register(() => import('./socket'));
