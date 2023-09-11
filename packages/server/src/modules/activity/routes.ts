import application, { middleware } from '@application';
import { ActivityFilters } from '@chess-tent/types';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import {
  canEditActivities,
  deleteActivity,
  findActivities,
  getActivity,
  patchActivity,
  saveActivity,
  sendActivity,
  updateActivity,
} from './middleware';
import * as activityService from './service';
import { UnauthorizedActivityEditError } from './errors';

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
  conditional(async (req, res) => {
    const activity = await activityService.getActivity(req.body.id);
    if (
      activity &&
      !activityService.canEditActivities(activity, res.locals.me.id)
    ) {
      throw new UnauthorizedActivityEditError();
    }
    return true;
  })(toLocals('activity', async (req, res) => req.body)),
  saveActivity,

  // Notification flow
  // TODO - refactor
  // - configure notifications to accept multiple users - notification.users
  // - configure notification.type instead of notificationType
  // - create/send notification should be the same?
  conditional((req, res) => !res.locals.activity.v)(
    toLocals(
      'notification.users',
      (req, res) =>
        // todo: rework
        () => {},
      // res.locals.activity.roles
      //   .map(
      //     ({ user, role }: Role<LessonActivityRole>) =>
      //       role === LessonActivityRole.STUDENT && user,
      //   )
      //   .filter(Boolean),
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
  getActivity,
  canEditActivities('activity'), //todo: this permission check will allow all participants to edit any aspect of activity. Action needs to be more granular.
  updateActivity,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/activity/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  toLocals('patch', req => req.body),
  getActivity,
  canEditActivities('activity'),
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
  canEditActivities('activities'),
  sendData('activities'),
);

application.service.registerGetRoute(
  '/activity/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  getActivity,
  canEditActivities('activity'),
  sendData('activity'),
);

application.service.registerDeleteRoute(
  '/activity/:activityId',
  identify,
  toLocals('activity.id', req => req.params.activityId),
  getActivity,
  canEditActivities('activity'),
  deleteActivity,
  sendData('activity'),
);
