import application, { middleware } from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import {
  canEditActivity,
  getActivity,
  saveActivity,
  findActivities,
  updateActivity,
  sendActivity,
} from './middleware';

const {
  identify,
  sendData,
  sendStatusOk,
  toLocals,
  createNotification,
  sendNotification,
} = middleware;

application.service.registerPostRoute(
  '/activity/save',
  identify,
  toLocals('activity', req => req.body),
  canEditActivity,
  saveActivity,

  // Notification flow
  toLocals('user', (req, res) => res.locals.activity.owner),
  toLocals('notificationType', TYPE_ACTIVITY),
  toLocals('state', (req, res) => ({
    activityId: res.locals.activity.id,
    activityTitle: res.locals.activity.subject.state.title,
  })),
  createNotification,
  sendNotification,
  sendActivity,

  sendStatusOk,
);
application.service.registerPostRoute(
  '/activity-update/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  toLocals('updates', req => req.body),
  canEditActivity,
  updateActivity,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/activities',
  identify,
  toLocals('filters', req => ({
    owner: req.body.owner,
    users: req.body.users,
    subject: req.body.subject,
    state: req.body.state,
  })),
  findActivities,
  sendData('activities'),
);

application.service.registerGetRoute(
  '/activity/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  getActivity,
  canEditActivity,
  sendData('activity'),
);
