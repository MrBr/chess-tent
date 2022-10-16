import application, { middleware } from '@application';
import { UsersFilters } from '@chess-tent/types';
import {
  addUser,
  validateUser,
  verifyUser,
  hashPassword,
  updateUser,
  findCoaches,
  getUser,
  updateUserActivity,
  welcomeMailMiddleware,
} from './middleware';
import { getUser as getUserService } from './service';
import { UserAlreadyExists } from './errors';
import { introMessagesCoach, introMessagesStudent } from './constants';

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

application.service.registerPostRoute(
  '/register',
  toLocals('user', req => req.body.user),
  validateUser(),
  hashPassword,
  addUser,
  // mentorship flow
  toLocals('studentId', (req, res) => res.locals.user.id),
  toLocals('coachId', req => req.body.options.referrer),
  addMentor,
  // Initial founder message flow
  toLocals('founder', () => getUserService({ id: process.env.FOUNDER_ID })),
  toLocals('rawMessages', (req, res) =>
    res.locals.user.coach ? introMessagesCoach : introMessagesStudent,
  ),
  createInitialFounderConversation,

  catchError(welcomeMailMiddleware),
  webLogin,
  sendData('user'),
);

application.service.registerPostRoute(
  '/invite-user',
  identify,
  toLocals('user.email', req => req.body.email),
  getUser('user'),
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
  '/coaches',
  identify,
  toLocals('filters', req => {
    const { name, studentElo, tagIds, search } = req.body as UsersFilters;
    return {
      name,
      studentElo,
      tagIds,
      search,
      coach: true,
    };
  }),
  findCoaches,
  sendData('users'),
);

application.service.registerGetRoute('/logout', webLogout, sendStatusOk);

application.service.registerGetRoute(
  '/me',
  identify,
  updateUserActivity,
  getUser('me'),
  sendData('me'),
);

application.service.registerGetRoute(
  '/user/:userId',
  identify,
  toLocals('user.id', req => req.params.userId),
  getUser('user'),
  sendData('user'),
);

application.service.registerPutRoute(
  '/me',
  identify,
  toLocals('user', (req, res) => {
    const userUpdates = { ...req.body, ...res.locals.me };
    delete userUpdates.password;
    delete userUpdates.nickname;
    delete userUpdates.email;
    delete userUpdates.state?.lastActivity;
    return userUpdates;
  }),
  validateUser(['password', 'email', 'nickname']),
  updateUser,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/user/validate',
  toLocals('user', req => req.body),
  validateUser(),
  sendStatusOk,
);
