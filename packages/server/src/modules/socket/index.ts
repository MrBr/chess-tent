import application from '@application';

import './service';
import './middleware/sync-middleware';
import './middleware/unsubscribe-middleware';

application.register(() => import('./socket'));
