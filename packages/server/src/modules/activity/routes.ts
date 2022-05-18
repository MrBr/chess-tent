import application, { middleware } from '@application';
import { ActivityFilters } from '@chess-tent/types';
import {
  canEditActivity,
  getActivity,
  saveActivity,
  findActivities,
  updateActivity,
  deleteActivity,
  patchActivity,
} from './middleware';

const { identify, sendData, sendStatusOk, toLocals } = middleware;

console.warn('TODO - activity notification flow');
application.service.registerPostRoute(
  '/activity/save',
  identify,
  toLocals('activity', req => req.body),
  canEditActivity,
  saveActivity,

  // Notification flow
  // TODO - refactor
  // - configure notifications to accept multiple users - notification.users
  // - configure notification.type instead of notificationType
  // - create/send notification should be the same?
  // toLocals('user', (req, res) => res.locals.activity.owner),
  // toLocals('notificationType', TYPE_ACTIVITY),
  // toLocals('state', (req, res) => ({
  //   activityId: res.locals.activity.id,
  //   activityTitle: res.locals.activity.subject.state.title,
  // })),
  // createNotification,
  // sendNotification,
  // TODO - Distinct create and update; send only on create
  // sendActivity,

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

application.service.registerPutRoute(
  '/activity/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  toLocals('patch', req => req.body),
  canEditActivity,
  patchActivity,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/activities',
  identify,
  toLocals(
    'filters',
    (req): ActivityFilters => ({
      users: req.body.users,
      subject: req.body.subject,
      subjectType: req.body.subjectType,
      date: req.body.date,
      completed: req.body.completed,
    }),
  ),
  findActivities,
  sendData('activities'),
);

application.service.registerGetRoute(
  '/activity/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  canEditActivity,
  getActivity,
  sendData('activity'),
);

application.service.registerDeleteRoute(
  '/activity/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  canEditActivity,
  deleteActivity,
  sendData('activity'),
);
