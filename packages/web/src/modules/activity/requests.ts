import { services, requests } from '@application';
import { ActivityResponse, ActivitiesResponse } from '@types';
import { Activity, User } from '@chess-tent/models';

const activity = services.createRequest<[string], ActivityResponse>(
  'GET',
  activityId => ({ url: `/activity/${activityId}` }),
);

const activitySave = services.createRequest<Activity, ActivityResponse>(
  'POST',
  '/activity/save',
);

const activities = services.createRequest<
  { owner: User['id'] },
  ActivitiesResponse
>('POST', '/activities');

requests.activity = activity;
requests.activitySave = activitySave;
requests.activities = activities;
