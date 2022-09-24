import application, { middleware } from '@application';
import { TYPE_MENTORSHIP } from '@chess-tent/models';
import {
  getCoaches,
  getStudents,
  resolveMentorshipRequest,
  requestMentorship,
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
  '/mentorship',
  identify,
  // Users can only request mentorship from coaches, not the other way around
  toLocals('studentId', (req, res) => res.locals.me.id),
  toLocals('coachId', req => req.body.coachId),
  requestMentorship,

  // Notification flow
  toLocals('notification.users', (req, res) => [res.locals.mentorship.coach]),
  toLocals('notification.type', TYPE_MENTORSHIP),
  toLocals('notification.state', (req, res) => ({
    text: `${res.locals.mentorship.student.name} requested mentorship`,
    student: res.locals.mentorship.student.id,
  })),
  createNotifications,
  sendNotifications,

  sendData('mentorship'),
);

application.service.registerPutRoute(
  '/mentorship',
  identify,
  toLocals('studentId', req => req.body.studentId),
  toLocals('coachId', req => req.body.coachId),
  toLocals('approved', req => req.body.approved),
  conditional((req, { locals: { coachId, me, studentId } }) =>
    // Every party can manipulate mentorship once requested
    [coachId, studentId].includes(me.id),
  )(resolveMentorshipRequest),
  sendStatusOk,
);

application.service.registerGetRoute(
  '/mentorship/coaches',
  identify,
  toLocals('studentId', (req, res) => res.locals.me.id),
  getCoaches,
  sendData('coaches'),
);

application.service.registerGetRoute(
  '/mentorship/students',
  identify,
  toLocals('coachId', (req, res) => res.locals.me.id),
  getStudents,
  sendData('students'),
);
