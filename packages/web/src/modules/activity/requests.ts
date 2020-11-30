import { services, requests } from '@application';
import { ActivityResponse, ActivitiesResponse, ActivityFilters } from '@types';
import { Activity, SubjectPathUpdate } from '@chess-tent/models';

const activity = services.createRequest<[string], ActivityResponse>(
  'GET',
  activityId => ({ url: `/activity/${activityId}` }),
);

const activitySave = services.createRequest<Activity, ActivityResponse>(
  'POST',
  '/activity/save',
);

const activityUpdate = services.createRequest<
  [Activity['id'], SubjectPathUpdate[]],
  ActivityResponse
>('POST', (activityId, updates) => ({
  url: `/activity-update/${activityId}`,
  data: updates,
}));

const activities = services.createRequest<ActivityFilters, ActivitiesResponse>(
  'POST',
  '/activities',
);

requests.activity = activity;
requests.activitySave = activitySave;
requests.activityUpdate = activityUpdate;
requests.activities = activities;
