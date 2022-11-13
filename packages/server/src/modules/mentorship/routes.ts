import application, { middleware, utils } from '@application';
import { TYPE_MENTORSHIP } from '@chess-tent/models';
import { PUSH_RECORD } from '@chess-tent/redux-record';
import {
  getCoaches,
  getStudents,
  resolveMentorshipRequest,
  requestMentorship,
  validateMentorshipUpdate,
} from './middleware';

const {
  identify,
  sendData,
  sendStatusOk,
  toLocals,
  sendNotifications,
  createNotifications,
  conditional,
  sendAction,
  sendMail,
  getUser,
} = middleware;

const { formatAppLink } = utils;

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

  // Email the coach
  toLocals('coach', req => ({ id: req.body.coachId })),
  getUser('+email')('coach'),
  getUser('+email')('me'),
  sendMail((req, res) => ({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: res.locals.coach.email,
    subject: 'Mentorship request',
    html: `<p>Hey,</p> 
      <p>You have a new mentorship request from ${
        res.locals.me.name
      }. Respond to request at <a href=${formatAppLink('/me/students')}> ${
      process.env.APP_DOMAIN
    }/me/students<a></p>
      <p>Best Regards, <br/>Chess Tent Team</p>`,
  })),

  toLocals(
    'action.channel',
    (req, res) => `user-${res.locals.mentorship.coach.id}`,
  ),
  toLocals('action.data', (req, res) => ({
    type: PUSH_RECORD,
    payload: {
      value: res.locals.mentorship,
    },
    meta: {
      key: 'my-students',
    },
  })),

  sendAction,
  sendData('mentorship'),
);

application.service.registerPutRoute(
  '/mentorship',
  identify,
  toLocals('studentId', req => req.body.studentId),
  toLocals('coachId', req => req.body.coachId),
  toLocals('approved', req => req.body.approved),
  validateMentorshipUpdate,
  resolveMentorshipRequest,
  toLocals('coach', req => ({ id: req.body.coachId })),
  getUser('+email')('coach'),
  toLocals('student', req => ({ id: req.body.studentId })),
  getUser('+email')('student'),
  conditional(req => req.body.approved)(
    sendMail((req, res) => ({
      from: 'Chess Tent <noreply@chesstent.com>',
      to: res.locals.student.email,
      subject: 'You got a coach!',
      html: `<p>Hey,</p> 
      <p>${
        res.locals.coach.name
      } accepted your mentorship request. Message your coach and schedule a training at <a href=${formatAppLink(
        '/',
      )}> ${process.env.APP_DOMAIN}<a></p>
      <p>Best Regards, <br/>Chess Tent Team</p>`,
    })),
  ),
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
