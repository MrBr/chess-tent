import application, { middleware } from '@application';
import { ActivityFilters } from '@chess-tent/types';
import { LessonActivityRole, Role, TYPE_ACTIVITY } from '@chess-tent/models';
import {
  canEditActivity,
  deleteActivity,
  findActivities,
  getActivity,
  patchActivity,
  saveActivity,
  sendActivity,
  updateActivity,
} from './middleware';

const {
  identify,
  sendData,
  sendStatusOk,
  toLocals,
  sendNotifications,
  createNotifications,
  conditional,
} = middleware;

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
  conditional((req, res) => !res.locals.activity.v)(
    toLocals('notification.users', (req, res) =>
      res.locals.activity.roles
        .map(
          ({ user, role }: Role<LessonActivityRole>) =>
            role === LessonActivityRole.STUDENT && user,
        )
        .filter(Boolean),
    ),
    toLocals('notification.type', TYPE_ACTIVITY),
    toLocals('notification.state', (req, res) => ({
      activityId: res.locals.activity.id,
      activityTitle: res.locals.activity.subject.state.title,
    })),
    createNotifications,
    sendNotifications,
    sendActivity,
  ),
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
