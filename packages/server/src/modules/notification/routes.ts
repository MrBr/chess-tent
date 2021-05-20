import application, { middleware } from '@application';
import { getNotifications, updateNotifications } from './middleware';

const { identify, sendData, toLocals, sendStatusOk } = middleware;

application.service.registerGetRoute(
  '/notifications',
  identify,
  toLocals('filters', (req, res) => ({
    user: res.locals.me.id,
    read: !!req.query.read,
    limit: req.query.limit,
    lastDocumentTimestamp: req.query.lastDocumentTimestamp,
  })),
  getNotifications,
  sendData('notifications'),
);

application.service.registerPutRoute(
  '/notifications',
  identify,
  toLocals('notificationIds', req => req.body.ids),
  toLocals('notificationUpdate', req => req.body.updates),
  updateNotifications,
  sendStatusOk,
);
