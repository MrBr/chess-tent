import { services, requests } from '@application';
import { Requests } from '@types';

const activity = services.createRequest<Requests['activity']>(
  'GET',
  activityId => `/activity/${activityId}`,
);
const activityDelete = services.createRequest<Requests['activityDelete']>(
  'DELETE',
  activityId => `/activity/${activityId}`,
);

const activitySave = services.createRequest<Requests['activitySave']>(
  'POST',
  '/activity/save',
);

const activityUpdate = services.createRequest<Requests['activityUpdate']>(
  'POST',
  activityId => `/activity-update/${activityId}`,
  (activityId, updates) => updates,
);

const activities = services.createRequest<Requests['activities']>(
  'POST',
  '/activities',
);

requests.activity = activity;
requests.activityDelete = activityDelete;
requests.activitySave = activitySave;
requests.activityUpdate = activityUpdate;
requests.activities = activities;
