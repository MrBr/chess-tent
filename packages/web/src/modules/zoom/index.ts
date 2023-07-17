import application from '@application';

import ZoomProvider from './components/zoom-provider';
import ZoomActivityView from './components/zoom-activity-view';
import ZoomHostControl from './components/controls/host-control';
import ZoomGuestControl from './components/controls/guest-control';

application.components.ZoomProvider = ZoomProvider;
application.components.ZoomActivityView = ZoomActivityView;
application.components.ZoomHostControl = ZoomHostControl;
application.components.ZoomGuestControl = ZoomGuestControl;
