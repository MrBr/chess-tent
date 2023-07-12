import { service, middleware } from '@application';
import { authorizeUserByCode, generateSignature } from './middleware';

const { identify, toLocals, sendData } = middleware;

service.registerPostRoute(
  '/zoom/authorize',
  identify,
  toLocals('code', req => req.body.code),
  toLocals('redirectUri', req => req.body.redirectUri),
  authorizeUserByCode,
  sendData('data'),
);

service.registerPostRoute(
  '/zoom/signature',
  identify,
  toLocals('meetingNumber', req => req.body.meetingNumber),
  toLocals('role', req => req.body.role),
  generateSignature,
  sendData('data'),
);
