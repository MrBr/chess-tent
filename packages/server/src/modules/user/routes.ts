import application, { middleware } from '@application';
import {
  addUser,
  validateUser,
  verifyUser,
  hashPassword,
  updateUser,
  findUsers,
  getUser,
  updateUserActivity,
} from './middleware';
import { UserAlreadyActivated, UserAlreadyExists } from './errors';

const {
  sendData,
  identify,
  webLogin,
  webLogout,
  toLocals,
  sendStatusOk,
  sendMail,
  validate,
  addMentor,
} = middleware;

application.service.registerPostRoute(
  '/register',
  toLocals('user', req => req.body.user),
  validateUser,
  hashPassword,
  addUser,
  // mentorship flow
  toLocals('studentId', (req, res) => res.locals.user.id),
  toLocals('coachId', req => req.body.options.referrer),
  addMentor,

  sendMail((req, res) => ({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: res.locals.user.email,
    subject: 'Beta Registration',
    html: `<p>Dear ${res.locals.user.name},</p> 
      <p>Thank you for registering for Chess Tent private beta. Due to limited resources users are activated with a delay. We are still in very early phase and kindly ask for patience and understanding.</p>
      <p>Best Regards, <br/>Chess Tent Team</p>`,
  })),
  sendData('user'),
);

application.service.registerPostRoute(
  '/invite-user',
  identify,
  toLocals('user.email', req => req.body.email),
  getUser,
  validate((req, res) => {
    if (res.locals?.user?.email) {
      throw new UserAlreadyExists();
    }
  }),
  toLocals('email', req => req.body.email),
  toLocals('link', req => req.body.link),
  sendMail((req, res) => ({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: res.locals.email,
    subject: 'Invitation link',
    html: `<p>Hey ${res.locals.email},</p> 
      <p>You've been invited to join Chess Tent. You can register at <a href=${res.locals.link}> ${process.env.APP_DOMAIN}/register<a></p>
      <p>Best Regards, <br/>Chess Tent Team</p>`,
  })),
  sendStatusOk,
);

application.service.registerGetRoute(
  '/user-activate/:id',
  identify,
  toLocals('user.id', req => req.params.id),
  getUser,
  validate((req, res) => {
    if (res.locals.user.active) {
      throw new UserAlreadyActivated();
    }
  }),
  toLocals('user', (req, res) => ({
    ...res.locals.user,
    active: true,
  })),
  updateUser,
  sendMail((req, res) => ({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: res.locals.user.email,
    subject: 'Beta Account Activated',
    html: `<p>Dear ${res.locals.user.name},</p> 
      <p>Great news! Your account for Chess Tent has been activated. You can now log in with your credentials by visiting link <a href="https://chestent.com/login">chesstent.com</a>.</p>
      <p>Best Regards, <br/>Chess Tent Team</p>`,
  })),
  sendStatusOk,
);

application.service.registerPostRoute(
  '/login',
  toLocals('user', req => req.body),
  verifyUser,
  webLogin,
  updateUserActivity,
  sendData('user'),
);

application.service.registerPostRoute(
  '/users',
  identify,
  toLocals('filters', req => req.body),
  findUsers,
  sendData('users'),
);

application.service.registerGetRoute('/logout', webLogout, sendStatusOk);

application.service.registerGetRoute(
  '/me',
  identify,
  toLocals('user', (req, res) => res.locals.me),
  updateUserActivity,
  getUser,
  sendData('user'),
);

application.service.registerGetRoute(
  '/user/:userId',
  identify,
  toLocals('user.id', req => req.params.userId),
  getUser,
  sendData('user'),
);

application.service.registerPutRoute(
  '/me',
  identify,
  toLocals('user', (req, res) => ({ ...req.body, ...res.locals.me })),
  updateUser,
  sendStatusOk,
);
