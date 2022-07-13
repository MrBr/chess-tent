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
import { getUser as getUserService } from './service';
import { UserAlreadyExists } from './errors';

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
  createInitialFounderConversation,
  catchError,
} = middleware;

const welcomeMailMiddleware = sendMail((req, res) => ({
  from: 'Chess Tent <noreply@chesstent.com>',
  to: res.locals.user.email,
  subject: 'Beta Registration',
  html: `<p>Dear ${res.locals.user.name},</p>
       <p>Thank you for registering. We are still in very early phase and feedback is much appreciated.</p>
       <p>${
         res.locals.user.coach ? 'Start teaching at ' : 'Start learning at '
       } <a href="https://chesstent.com">chesstent.com</a>. </p>
       <p>Best Regards, <br/>Chess Tent Team</p>`,
}));

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
  // Initial founder message flow
  toLocals('founder', () => getUserService({ id: process.env.FOUNDER_ID })),
  createInitialFounderConversation,

  catchError(welcomeMailMiddleware),
  webLogin,
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
  sendMail(req => ({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: req.body.email,
    subject: 'Invitation link',
    html: `<p>Hey,</p> 
      <p>You've been invited to join Chess Tent. You can register at <a href=${req.body.link}> ${process.env.APP_DOMAIN}/register<a></p>
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
