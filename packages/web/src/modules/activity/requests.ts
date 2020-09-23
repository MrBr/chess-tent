import { services, requests } from '@application';
import { ActivityResponse, ActivitiesResponse, ActivityFilters } from '@types';
import { Activity } from '@chess-tent/models';

const activity = services.createRequest<[string], ActivityResponse>(
  'GET',
  activityId => ({ url: `/activity/${activityId}` }),
);

const activitySave = services.createRequest<Activity, ActivityResponse>(
  'POST',
  '/activity/save',
);

const activities = services.createRequest<ActivityFilters, ActivitiesResponse>(
  'POST',
  '/activities',
);

requests.activity = activity;
requests.activitySave = activitySave;
requests.activities = activities;
