import application, { middleware, service, utils } from '@application';
import { Auth } from '@types';
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
  getPublicCoaches,
} from './middleware';
import { getUser as getUserService } from './service';
import { UserAlreadyExists } from './errors';
import {
  DEFAULT_SIGNED_PROFILE_URL_EXPIRATION_TIME,
  introMessagesCoach,
  introMessagesInvitedStudent,
  introMessagesStudent,
} from './constants';

const { generateToken, verifyToken, generatePutFileSignedUrl } = service;
const { formatAppLink } = utils;

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
  conditional,
} = middleware;

application.service.registerPostRoute(
  '/register',
  toLocals('user', req => req.body.user),
  toLocals('user.state.lastActivity', new Date()),
  validateUser(),
  hashPassword,
  addUser,
  // mentorship flow
  toLocals('studentId', (req, res) => res.locals.user.id),
  toLocals('coachId', req => req.body.options.referrer),
  conditional((req, res) => !!res.locals.coachId)(addMentor),
  // Initial founder message flow
  toLocals('founder', () => getUserService({ id: process.env.FOUNDER_ID })),
  toLocals('rawMessages', (req, res) =>
    res.locals.user.coach
      ? introMessagesCoach
      : res.locals.mentorship
      ? introMessagesInvitedStudent
      : introMessagesStudent,
  ),
  createInitialFounderConversation,

  catchError(welcomeMailMiddleware)(),
  webLogin,
  sendData('user'),
);

application.service.registerPostRoute(
  '/invite-user',
  identify,
  toLocals('user.email', req => req.body.email),
  getUser('+email')('user'),
  validate((req, res) => {
    if (res.locals?.user?.email) {
      throw new UserAlreadyExists();
    }
  }),
  getUser('+email')('me'),
  sendMail((req, res) => ({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: req.body.email,
    // It's important to track who sends email to prevent abuse
    cc: res.locals.me.email,
    subject: 'Invitation to Chess Tent',
    html: `<p>Hey,</p> 
      <p>${res.locals.me.name} invited you to join Chess Tent. You can register at <a href=${req.body.link}> ${process.env.APP_DOMAIN}/register<a></p>
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
  getUser()('me'),
  sendData('me'),
);

application.service.registerGetRoute(
  '/user/:userId',
  identify,
  toLocals('user.id', req => req.params.userId),
  getUser()('user'),
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

// This route exists to prevent a user from overriding other images
// In some distant future permissions should be granted per a file key
application.service.registerPostRoute(
  '/sign-profile-image',
  identify,
  async (req, res, next) => {
    try {
      res.locals.url = await generatePutFileSignedUrl({
        Key: res.locals.me.id,
        Expires: DEFAULT_SIGNED_PROFILE_URL_EXPIRATION_TIME,
        ContentType: req.body.contentType,
        ACL: 'public-read',
      });
    } catch (e) {
      next(e);
      return;
    }
    next();
  },
  sendData('url'),
);

application.service.registerPostRoute(
  '/user/forgot-password',
  toLocals('user', req => ({ email: req.body.email })),
  getUser('+email')('user'),
  // This gives some information about existing user email even if somebody is faking.
  // Response could always be positive to hide that information.
  // However, if email is taken can still be validated on registration.
  validate((req, res) => {
    if (!res.locals.user) {
      throw new Error("User doesn't exists.");
    }
  }),
  toLocals('resetToken', (req, res) =>
    generateToken(
      { user: { id: res.locals.user.id } },
      process.env.TOKEN_RESET_SECRET as string,
      { expiresIn: 60 * 60 * 6 }, // 6h
    ),
  ),
  sendMail((req, res) => ({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: req.body.email,
    subject: 'Reset password',
    html: `<p>Hey,</p>
      <p>We've received password reset request. You can reset your password at <a href=${formatAppLink(
        `/reset-password?resetToken=${res.locals.resetToken}`,
      )}> ${formatAppLink('/reset-password')}<a></p>
      <p>If you haven't requested password reset please notify us at info@chesstent.com</p>
      <p>Best Regards, <br/>Chess Tent Team</p>`,
  })),
  sendStatusOk,
);

application.service.registerPostRoute(
  '/user/reset-password',
  toLocals(
    'user',
    (req, res) =>
      verifyToken<Auth['apiTokenPayload']>(
        req.body.token,
        process.env.TOKEN_RESET_SECRET as string,
      ).user,
  ),
  getUser('+email')('user'),
  // Additional layer of security, if somebody randomly gets token still has to know email
  validate((req, res) => {
    if (res.locals.user?.email !== req.body.email) {
      throw new Error("Provided information don't match.");
    }
  }),
  // Override user data - update only password
  toLocals('user', (req, res) => ({
    id: res.locals.user.id,
    password: req.body.password,
  })),
  hashPassword,
  updateUser,
  sendStatusOk,
);

application.service.registerGetRoute(
  '/public-coaches',
  getPublicCoaches,
  sendData('coachData'),
);
